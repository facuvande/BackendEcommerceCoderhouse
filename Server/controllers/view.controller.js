import UsersService from "../dao/Services/users.service.js";
import ProductService from "../dao/Services/products.service.js";
import TicketFactory from "../dao/Factorys/ticket.factory.js";
import CartService from '../dao/Services/carts.service.js'
import config from "../config.js";
import { emailService } from "../external-services/email.service.js";
import { verifyToken } from "../utils/tokenGenerate.js";

const Tickets = await TicketFactory.getDao()
const TicketsService = new Tickets();
class ViewController{
    #CartService
    #ProductService
    #UserService
    #TicketsService;
    constructor(CartService, ProductService, UserService, ticketsService){
        this.#CartService = CartService;
        this.#ProductService = ProductService;
        this.#TicketsService = ticketsService;
        this.#UserService = UserService;
    }

    async init(req, res){
        res.redirect('/login')
    }

    async registerPage(req, res){
        const email = req.user?.email ?? null;
        if(email){
            // Si ya existe el dato del email en la session lo redireccionamos al perfil
            return res.redirect('/products');
        }
        res.render('register')
    }

    async loginPage(req, res){
        const errorMessage = req.query.error ? 'Email o contrasena incorrectos' : '';
        const email = req.cookies.current
    
        if(email){
            return res.redirect('/products');
        }
        res.render('login', { errorMessage })
    }

    async passwordResetOk(req, res){
        try {
            console.log(req.params.data)
            console.log(verifyToken(req.params.data))
            const isValidToken = verifyToken(req.params.data)
            res.render('reset-password-ok')
            
        } catch (error) {
            console.log(error)
            res.redirect('/password_reset')
        }
    
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
                const user = await this.#UserService.findByEmail(email)
                
                res.render('products', {
                    data: products.docs,
                    pages: products.totalPages,
                    page: products.page,
                    prev: products.prevPage,
                    next: products.nextPage,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    paginas: numbers,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    isAdmin: user.role == 'ADMIN',
                    profileImg: user.profileImg ? user.profileImg : 'default.jpg'
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
                const { firstName, lastName, role } = await this.#UserService.findByEmail(email);
                console.log(products)
                res.render('product_detail', {
                    data: JSON.parse(JSON.stringify(products)),
                    userInfo: {
                        firstName,
                        lastName,
                        role,
                        isAdmin: role == 'ADMIN'
                    }
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
            const { email } = req.user;
            const products = await this.#ProductService.get()
            const user = await this.#UserService.findByEmail(email)

            res.render('realTimeProducts',{
                data: products,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.role == 'ADMIN',
                profileImg: user.profileImg ? user.profileImg : 'default.jpg'
            })
        } catch (error) {
            next(error)
        }
    }

    async viewCart(req, res, next){
        try {
            const {email} = req.user
            const user = await this.#UserService.findByEmail(email)
            const products = await this.#CartService.getWithId(user.cart._id);
            
            const purchaseData = {
                status: req.query.collection_status,
                payment_id: req.query.payment_id,
                payment_type: req.query.payment_type,
                preference_id: req.query.preference_id,
            }
            
            console.log(req.query.collection_status)

            let total = 0;

            products.products.forEach(product => {
                total += product.product.price * product.quantity
            })
                        
            res.render('cart', {
                data: products.products,
                total: total.toLocaleString(),
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.role == 'ADMIN',
                profileImg: user.profileImg ? user.profileImg : 'default.jpg'
            })
        } catch (error) {
            next(error)
        }
    }

    async viewEditProfile(req, res, next){
        try {
            const { email } = req.user
            if(!email){
                return res.redirect('/login');
            }
    
            const { firstName, lastName, age, role, profileImg } = await this.#UserService.findByEmail(email);
            res.render('editprofile', {
                firstName,
                lastName,
                age,
                isAdmin: role == 'ADMIN',
                profileImg: profileImg ? profileImg : 'default.jpg'
            })
        } catch (error) {
            console.log(error)
        }
    }

    async paymentSuccess(req, res, next){
        try {
            const { email } = req.user;
            const { firstName, lastName, age, role, profileImg, cart } = await this.#UserService.findByEmail(email);
            const {
                payment_id,
                collection_status,
                payment_type,
                preference_id,
                merchant_order_id,
            } = req.query
            
            if(!payment_id){
                return res.redirect('/products')
            }

            const savePayment = await this.#UserService.savePaymentHistory(email, {
                id: preference_id,
                collection_status,
                payment_type,
                payment_id,
                merchant_order_id
            })

            const payment = savePayment.find(pay => pay.id === preference_id);
            
            const totalPrice = payment.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0)

            if(payment.status == 'approved'){
                const deletedCart = await this.#CartService.deleteAllProductToCart(cart._id);
        
                const ticketToSend = {
                    code: payment.payment_id,
                    purchase_datatime: new Date(),
                    amount: totalPrice,
                    purchaser: email,
                }
        
                const saveTicket = await this.#TicketsService.generateTicket(ticketToSend)
                console.log(saveTicket)
                await emailService.sendEmail({ to: email, subject: 'Muchas gracias por tu compra, adjuntamos el ticket', html: `Ticket de compra: ${saveTicket}`})


                res.render('pay_status',{
                    status: payment.status == 'approved',
                    payment_id: payment.payment_id,
                    firstName,
                    lastName,
                    age,
                    isAdmin: role == 'ADMIN',
                    profileImg: profileImg ? profileImg : 'default.jpg'
                })
            }else{
                res.render('pay_status',{
                    status: payment.status == false,
                    payment_id: payment.payment_id,
                    firstName,
                    lastName,
                    age,
                    isAdmin: role == 'ADMIN',
                    profileImg: profileImg ? profileImg : 'default.jpg'
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    async viewUserAdministrator(req, res, next){
        try {
            const users = await this.#UserService.getAll()
            const { email } = req.user;

            const user = await this.#UserService.findByEmail(email)

            res.render('usersGestion',{
                data: users,
                firstName: user.firstName,
                lastName: user.lastName,
                age: user.age,
                isAdmin: user.role == 'ADMIN',
                profileImg: user.profileImg ? user.profileImg : 'default.jpg'
            })
        } catch (error) {
            next(error)
        }
    }
}

const controller = new ViewController(new CartService(),new ProductService(),new UsersService(), TicketsService);
export default controller