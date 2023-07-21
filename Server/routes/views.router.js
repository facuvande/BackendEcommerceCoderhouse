import { Router } from 'express'
import { authenticated, authorized } from '../config/middlewares/auth.js'
import ViewController from '../controllers/view.controller.js'
import passport from 'passport'
import { verifyToken } from '../utils/tokenGenerate.js'


const route = Router()

// Users views routs

route.get('/', (req, res) =>{
    res.redirect('/login')
})

route.get('/register', (req, res) =>{
    const email = req.user?.email ?? null;
    if(email){
        // Si ya existe el dato del email en la session lo redireccionamos al perfil
        return res.redirect('/products');
    }
    res.render('register')
})

route.get('/login', (req, res) =>{
    const errorMessage = req.query.error ? 'Email o contrasena incorrectos' : '';
    const email = req.cookies.current

    if(email){
        return res.redirect('/products');
    }
    res.render('login', { errorMessage })
})

route.get('/password_reset', (req, res) => {
    res.render('reset-password')
})

route.get('/reset-password-ok/:data', (req, res) => {
    try {
        console.log(req.params.data)
        console.log(verifyToken(req.params.data))
        const isValidToken = verifyToken(req.params.data)
        res.render('reset-password-ok')
        
    } catch (error) {
        res.redirect('/password_reset')
    }

})

// Products

// Vista general de Productos
route.get('/products', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), ViewController.viewStore.bind(ViewController))
// Detalles de Producto
route.get('/products/:id', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), ViewController.viewDetailsProduct.bind(ViewController))
// Vista Tiempo Real de Productos
route.get('/realtimeproducts', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN']), ViewController.viewRealTimeProducts.bind(ViewController))

// Carts

route.get('/carts/:cid', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN']) , ViewController.viewCart.bind(ViewController))

export default route