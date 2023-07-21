import UsersService from "../dao/Services/users.service.js";
import ProductService from "../dao/Services/products.service.js";
import CartService from '../dao/Services/carts.service.js'
import config from "../config.js";

import axios from "axios";


class ViewController{
    #CartService
    #ProductService
    #UserService
    constructor(CartService, ProductService, UserService){
        this.#CartService = CartService;
        this.#ProductService = ProductService;
        this.#UserService = UserService;
    }

    async viewStore (req, res, next){
        try {
            const email = req.user?.email ?? null;
            const query = req.query;
            const categoryFilter = query.category ? { category: query.category } : {}
            const statusFilter = query.status ? { status: query.status } : {}
            
            const numbers = [];
            
            if(query.sort && (query.sort == 'asc' || query.sort == 'desc')){
                query.sort = {price: query.sort == 'asc' ? 1 : -1};
            }
            
            const filters = {
                ...categoryFilter,
                ...statusFilter
            }
            
            const products = await this.#ProductService.getAll(
                filters,
                { page: query.page ?? 1, limit: query.limit ?? 10, sort: query.sort, lean: true } 
            )
            
            const cantPages = products.totalPages;
    
            for(let i = 1; i<=cantPages; i++){
                numbers.push(i)
            }
    
            if(email == config.admin_email) {
                return res.render('products', {
                    data: products.docs,
                    pages: products.totalPages,
                    page: products.page,
                    prev: products.prevPage,
                    next: products.nextPage,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    paginas: numbers,
                    firstName: 'Administrador',
                    role: 'ADMIN'
                })
            } else if(email){
                const {firstName, lastName, role} = await this.#UserService.findByEmail(email)
    
                res.render('products', {
                    data: products.docs,
                    pages: products.totalPages,
                    page: products.page,
                    prev: products.prevPage,
                    next: products.nextPage,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    paginas: numbers,
                    firstName,
                    lastName,
                    role
                })
            }else{
                return res.redirect('/login');
            }
        } catch (error) {
            next(error)
        }
    }

    async viewDetailsProduct(req, res, next){
        try {
            const email = req.user?.email ?? null
            if(email){
                const id = req.params.id
                const products = await this.#ProductService.getWithId(id)
    
                res.render('product_detail', {
                    data: JSON.parse(JSON.stringify(products))
                })
            }else{
                return res.redirect('/login')
            }
        } catch (error) {
            next(error)
        }
    }

    async viewRealTimeProducts (req, res, next){
        try {
            const products = await this.#ProductService.get()
            
            res.render('realTimeProducts',{
                data: products
            })
        } catch (error) {
            next(error)
        }
    }

    async viewCart(req, res, next){
        try {
            const cid = req.params.cid
            const products = await axios.get(`http://localhost:8080/api/carts/${cid}`)

            res.render('cart', {
                data: products.data.products
            })
        } catch (error) {
            next(error)
        }
    }
}

const controller = new ViewController(new CartService(),new ProductService(),new UsersService());
export default controller