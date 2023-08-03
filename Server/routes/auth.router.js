import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js'
import passport from 'passport'

const route = Router()

route.post('/login', passport.authenticate('login', { failureRedirect: '/login?error=1'}), AuthController.login.bind(AuthController));
route.post('/logout', AuthController.logout.bind(AuthController));
route.post('/register', passport.authenticate('register', {
    failureRedirect: '/api/auth/failureregister'
}), AuthController.register.bind(AuthController))

route.get('/failureregister', (req, res) => res.send({message: 'Error en el registro'}))
route.get('/failurelogin', (req, res) => res.send({error: 'Usuario o contrasenia incorrectos'}))
route.get('/unautorized', (req, res) => res.redirect('/login'))

route.get('/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) =>{})
route.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), AuthController.githubCallback.bind(AuthController))

route.post('/reset-password', AuthController.resetPassword.bind(AuthController))
route.post('/reset-password-ok/:token', AuthController.resetPasswordOk.bind(AuthController))

export default route