import { Router } from 'express'
import { authorized } from '../config/middlewares/auth.js'
import ViewController from '../controllers/view.controller.js'
import passport from 'passport'

const route = Router()

// Users views routs

route.get('/', ViewController.init.bind(ViewController))
route.get('/register', ViewController.registerPage.bind(ViewController))
route.get('/login', ViewController.loginPage.bind(ViewController))
route.get('/password_reset', (req, res) => {
    res.render('reset-password')
})
route.get('/reset-password-ok/:data', ViewController.passwordResetOk.bind(ViewController))
route.get('/edit-profile', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), ViewController.viewEditProfile.bind(ViewController))
route.get('/users-administrator', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN']), ViewController.viewUserAdministrator.bind(ViewController))

// Products

// Vista general de Productos
route.get('/products', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), ViewController.viewStore.bind(ViewController))
// Detalles de Producto
route.get('/products/:id', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), ViewController.viewDetailsProduct.bind(ViewController))
// Vista Tiempo Real de Productos
route.get('/realtimeproducts', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN']), ViewController.viewRealTimeProducts.bind(ViewController))

// Carts

route.get('/carts', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN', 'USER']) , ViewController.viewCart.bind(ViewController))

// Payments
route.get('/payment/success', passport.authenticate('current', { failureRedirect: '/api/auth/unautorized'}), authorized(['ADMIN', 'USER']) , ViewController.paymentSuccess.bind(ViewController))


export default route