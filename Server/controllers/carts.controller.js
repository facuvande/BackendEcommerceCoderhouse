import crypto from 'crypto';
import CartsFactory from "../dao/Factorys/carts.factory.js";
import CartRepository from '../repository/carts.repository.js';
import ProductsFactory from '../dao/Factorys/products.factory.js';
import ProductRepository from '../repository/product.repository.js';
import UsersFactory from "../dao/Factorys/users.factory.js";
import TicketFactory from "../dao/Factorys/ticket.factory.js";
import logger from '../logger/winston-logger.js';

const Carts = await CartsFactory.getDao()
const CartService = new CartRepository(new Carts)

const Products = await ProductsFactory.getDao()
const ProductService = new ProductRepository(new Products)

const Users = await UsersFactory.getDao()
const UsersService = new Users()

const Tickets = await TicketFactory.getDao()
const TicketsService = new Tickets();

class CartController{
    #service;
    #productService;
    #userService;
    #TicketsService;
    constructor(service, productService, usersService, ticketsService){
        this.#service = service;
        this.#productService = productService;
        this.#userService = usersService;
        this.#TicketsService = ticketsService;
    }

    async create(req, res, next){
        try {
            const newCart = await this.#service.create()
            res.status(201).send({id: newCart})
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    
    async getWithId(req, res, next){
        try {
            const cid = req.params.cid
            
            const product = await this.#service.getWithId(cid)
            
            await (!product) ? res.status(404).send('Id de carrito inexistente') : res.status(201).send(product)
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async addToCart(req, res, next){
        try {
            console.log(req.user)
            const cid = req.params.cid
            const pid = req.params.pid
                
            const product = await this.#productService.getWithId(pid)
            
            if(req.user.email === product.owner){
                res.status(400).send({error: "No puedes agregar al carrito un producto que te pertenece"})
            }else{
                const cart = await this.#service.addProductToCart(cid, product)
                res.status(202).send(product)
            }
            
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async deleteProductToCart(req, res, next){
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
    
            const deleteProduct = await this.#service.deleteProductToCart(cid, pid)

            res.send({eliminado: deleteProduct})
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async deleteAllProductToCart(req, res, next){
            try {
                const cid = req.params.cid;
                
                const deleteCart = await this.#service.deleteAllProductToCart(cid)
                res.send('Proceso exitoso' + deleteCart)
            } catch (error) {
                logger.error(`Error - ${req.method} - ${error}`)
                next(error)
            }
    }

    async updateProductToCart(req, res, next){
        try {
            const cartId = req.params.cid;
            const newProducts = req.body;
            
            const idList = newProducts.map(product => product.id)
    
            // Verificamos que el id enviado sea coincidente con un producto existente
            const productExist = await this.#service.getWithId(idList)

            // Actualizamos el array de productos del carrito con los nuevos datos
            const update = await this.#service.updateProductToCart(cartId, newProducts)
    
            res.status(202).send(update);
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async purchase(req, res, next){
        try {
            const ticket = [];
            const outOfStock = [];

            const cartToPurchase = await this.#service.getWithId(req.params.cid)

            cartToPurchase.products.forEach(item =>{
                if(item.quantity <= item.product.stock){
                    ticket.push(item);
                    const itemStock = item.product.stock - item.quantity
                    const editProduct = this.#productService.editProduct(item.product.id, {stock: itemStock})
                }else{
                    outOfStock.push(item)
                }
            })
            
            const totalPrice = ticket.reduce((acc, item) =>{
                const productPrice = item.product.price
                const quantity = item.quantity
                const itemTotalPrice = productPrice * quantity
                return acc + itemTotalPrice
            }, 0)
            
            const purchaser = await this.#userService.findByCart(req.params.cid)

            // Generamos el código de compra
            const timestamp = Date.now().toString();
            const randomBytes = crypto.randomBytes(8).toString('hex');
            const hash = crypto.createHash('sha256').update(timestamp + randomBytes).digest('hex');
            const code = hash.slice(0, 16);

            const ticketToSend = {
                code,
                purchase_datatime: new Date(),
                amount: totalPrice,
                purchaser: purchaser.email,
                cart: req.params.cid,
            }
            
            const saveTicket = await this.#TicketsService.generateTicket(ticketToSend)
            const getTicket = await this.#TicketsService.getAll()

            // Elimina productos comprados del carrito
            ticket.forEach(async (item) =>{
                const productId = item.product._id
                console.log({item: productId})
                await this.#service.deleteProductToCart(req.params.cid, productId)
            })

            if(outOfStock.length > 0){
                return res.status(200).send({ticket: getTicket, productosSinStock: outOfStock})
            }else{
                res.status(200).send({getTicket})
            }
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }
}

const controller = new CartController(CartService, ProductService, UsersService, TicketsService);
export default controller

