import roles from '../config/roles.js';
import ProductsFactory from '../dao/Factorys/products.factory.js';
import logger from '../logger/winston-logger.js';
import ProductRepository from '../repository/product.repository.js';
import { emailService } from '../external-services/email.service.js';

const Products = await ProductsFactory.getDao()
const ProductService = new ProductRepository(new Products)

class ProductsController{
    #service;
    #emailService;
    constructor(service, emailservice){
        this.#service = service;
        this.#emailService = emailservice;
    }

    async save (req, res, next){
        try {
            // console.log({usuario: req.user})
            const producto = req.body;
            console.log('Body del producto')
            console.log(req.body)
            const img = req.files
            console.log('Img del producto')
            console.log(req.files)
            
            // Debido a que si ponemos mas de una imagen req.files me otorga 2 objetos 1 por imagen, no puedo acceder con req.files.filename por lo tanto uso este metodo para extraer sus respectivos filename y guardarlo en la constante filenames
            const filenames = []
        
            for(const key in img){
                if(img.hasOwnProperty(key)){
                    const files = img[key];
                    
                    if(Array.isArray(files)){
                        files.forEach(file =>{
                            filenames.push(file.filename)
                        })
                    }else{
                        filenames.push(files.filename)
                    }
                    
                }
            }
    
            const existsCode = await this.#service.getWithCode(producto.code)
            if(existsCode){
                throw new Error('El campo code esta repetido')
            }

            const {_id} = await this.#service.save({...producto, thumbnail: filenames, owner: req.user.email})
            res.status(201).send({id: _id})
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async getAll (req, res, next){
        try {
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            let sort = req.query.sort
            const query = {};
            if(req.query.category){
                query.category = req.query.category;
            }
            
            if(req.query.status){
                query.status = req.query.status;
            }
    
            
            if(sort && (sort == 'asc' || sort == 'desc')){
                sort = {price: sort == 'asc' ? 1 : -1};
            }
    
            // Validacion en caso de que haya limit
            if(isNaN(Number(limit))){
                res.status(400).send({status: "error", payload: "El limit ingresado es invalido"})
                return;
            }
    
            // Validacion en caso de que se ingrese page
            if(isNaN(Number(page)) || parseInt(page) < 1){
                res.status(400).send({status: "error", payload: 'El valor de page es invalido'})
                return
            }
    
            // Se realiza la paginacion conforme a los querys seleccionados
            const product = await this.#service.getAll(query, { lean: true, sort, page, limit})
    
            res.send({
                success: true,
                payload: product.docs,
                totalPages: product.totalPages,
                prevPage: product.prevPage,
                nextPage: product.nextPage, 
                page: product.page, 
                hasPrevPage: product.hasPrevPage, 
                hasNextPage: product.hasNextPage, 
                prevLink: "", 
                nextLink: ""
            })
            } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
                next(error)
        }
    }

    async getWithId(req, res, next){
        try {
            const pid = req.params.pid;
            if(pid){
                const productId = await this.#service.getWithId(pid)
                res.status(202).send(productId)
            }else{
                res.status(400).send('Ingresaste un caracter invalido')
            }
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    
    }

    async editProduct(req, res, next){
        try {
            const idProduct = req.params.pid;
            const newData = req.body;

            const existProduct = await this.#service.getWithId(idProduct)
            if(!existProduct){
                return res.status(400).send({error: 'El producto no existe'});
            }
    
            const id = await this.#service.editProduct(idProduct, newData)
            res.status(201).send({sucess: 'Exito en actualizar producto'})
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async deleteProduct (req, res, next){
        try {
            const idProduct = req.params.pid
            const user = req.user

            const {owner} = await this.#service.getWithId(req.params.pid)
            
            // Si el usuario es premium
            if(user.role === roles.PREMIUM){
                // Solo puede eliminar los productos que creo
                if(user.email === owner){
                    const Product = await this.#service.deleteProduct(idProduct)
                    res.status(201).send({'Exito al eliminar el producto': idProduct})
                }else{
                    res.status(400).send({error: 'Error, solo puedes eliminar los productos que creaste'})
                }
            }else{
                // Si es ADMIN elimina cualquier producto
                const { owner, title } = await this.#service.getWithId(idProduct)
                console.log(owner)
                await this.#emailService.sendEmail(
                    {
                        from: `"Tu producto ${title} fue eliminado" <facundovs84@hotmail.com.ar>`, 
                        to: owner, 
                        subject: 'Tu producto fue eliminado por un administrador.', 
                        html: `Lamentablemente por algun motivo tu producto fue eliminado por un administrador, porfavor deje de subir productos que no cumplan con las normas de la pagina.`
                })
                const Product = await this.#service.deleteProduct(idProduct)
                res.status(201).send({'Exito al eliminar el producto': idProduct})
            }
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }
}

const controller = new ProductsController(ProductService, emailService);
export default controller

