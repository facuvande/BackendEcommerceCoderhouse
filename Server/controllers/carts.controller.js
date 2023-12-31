import crypto from 'crypto';
import CartsFactory from "../dao/Factorys/carts.factory.js";
import CartRepository from '../repository/carts.repository.js';
import ProductsFactory from '../dao/Factorys/products.factory.js';
import ProductRepository from '../repository/product.repository.js';
import UsersFactory from "../dao/Factorys/users.factory.js";
import TicketFactory from "../dao/Factorys/ticket.factory.js";
import logger from '../logger/winston-logger.js';
import PaymentService from '../dao/Services/payment.service.js';
import PaymentController from './payment.controller.js'

const Carts = await CartsFactory.getDao()
const CartService = new CartRepository(new Carts)

const Products = await ProductsFactory.getDao()
const ProductService = new ProductRepository(new Products)

const Users = await UsersFactory.getDao()
const UsersService = new Users()

const Tickets = await TicketFactory.getDao()
const TicketsService = new Tickets();

const PaymentsService = new PaymentController(new PaymentService())

class CartController{
    #service;
    #productService;
    #userService;
    #TicketsService;
    #PaymentsService;
    constructor(service, productService, usersService, ticketsService){
        this.#service = service;
        this.#productService = productService;
        this.#userService = usersService;
        this.#TicketsService = ticketsService;
        this.#PaymentsService = PaymentsService;
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

    async addToCartOutCid(req, res, next){
        try {
            const { email } = req.user
            const user = await this.#userService.findByEmail(email)
            const pid = req.params.pid

            const product = await this.#productService.getWithId(pid)

            if(!product.status){
                return res.status(400).send({error: "Producto sin stock"})
            }
            
            if(req.user.email === product.owner){
                res.status(400).send({error: "No puedes agregar al carrito un producto que te pertenece"})
            }else{
                const cart = await this.#service.addProductToCart(user.cart._id, product)
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

    async deleteProductToCartOutCid(req, res, next){
        try {
            const pid = req.params.pid;
            const { email } = req.user;
            const user = await this.#userService.findByEmail(email)

            const deleteProduct = await this.#service.deleteProductToCart(user.cart._id, pid)
            res.status(202).send({eliminado: deleteProduct});
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

    async deleteAllProductToCartOutCid(req, res, next){
        try {
            const { email } = req.user;

            const user = await this.#userService.findByEmail(email)
            const deleteCart = await this.#service.deleteAllProductToCart(user.cart._id)
            res.status(202).send({eliminado: deleteCart});
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

    async purchase (req, res, next){
        try {
            const { email } = req.user;
            const findUser = await this.#userService.findByEmail(email)
    
            const cartToPurchase = await this.#service.getWithId(findUser.cart)
    
            const itemsToPurchase = [];
    
            cartToPurchase.products.forEach(item =>{
                // Si la cantidad comprada es menor al stock del producto
                if(item.quantity <= item.product.stock){
                    itemsToPurchase.push({
                        title: item.product.title,
                        description: item.product.description,
                        category_id: item.product.category,
                        quantity: item.quantity,
                        unit_price: item.product.price
                    })
                }
            })
    
            req.itemsToPurchase = itemsToPurchase;
            const payment = await PaymentsService.getPaymentLink(req, res);
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }
}

const controller = new CartController(CartService, ProductService, UsersService, TicketsService, PaymentsService);
export default controller

