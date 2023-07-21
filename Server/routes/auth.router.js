import { Router } from 'express'
import usersModel from '../dao/models/users.model.js'
import passport from 'passport'
import { generateToken, verifyToken } from '../utils/tokenGenerate.js'
import { emailService } from '../external-services/email.service.js'
import UsersService from '../dao/Services/users.service.js'
import {createHash, isValidPassword} from '../utils/crypto.js'

const route = Router()
const usersService = new UsersService()

route.post('/login', passport.authenticate('login', { failureRedirect: '/login?error=1'}), async (req, res, next) =>{
    const user = req.user;
    
    const token = generateToken({
        _id: user._id,
        email: user.email,
        // role: 'ADMIN'
        role: user.role.toUpperCase()
    })
    res.cookie('current', token, {
        httpOnly: true,
        maxAge: 3600000
    })

    res.redirect('/products')
    // res.send({status: 'login ok'})
})

route.post('/logout', async(req, res) =>{
    const user = (req.user)

    // Hacer que se actualice la ultima conexion
    await usersModel.updateOne({ _id: user._id }, { $set: { last_connection: new Date() }});

    res.clearCookie('current');
    res.clearCookie('connect.sid')
    res.redirect('/login')
})

route.post('/register', passport.authenticate('register', {
    failureRedirect: '/api/auth/failureregister'
}), async(req, res, next) =>{
    console.log('entra')
    req.user = null;
    res.status(201).send({message: `Usuario Creado`})
})

route.get('/failureregister', (req, res) =>{
    res.send({message: 'Error en el registro'})
})
route.get('/failurelogin', (req, res) =>{
    res.send({error: 'Usuario o contrasenia incorrectos'})
})
route.get('/unautorized', (req, res) =>{
    res.redirect('/login')
})

route.get('/github', passport.authenticate('github', { scope: ['user: email']}),
    (req, res) =>{}
)

route.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), (req, res) =>{
    const user = req.user;

    const token = generateToken({
        _id: user.id,
        email: user.email,
        // role: 'ADMIN'
        role: user.role.toUpperCase()
    })
    res.cookie('current', token, {
        httpOnly: true,
        maxAge: 3600000
    })    

    res.redirect('/products')
})

route.post('/reset-password', async (req, res) => {
    try {
        console.log(req.body.email)

        const isValidEmail = await usersService.findByEmail(req.body.email)
        console.log(isValidEmail)
        if(!isValidEmail) return res.status(404).send({error: 'Email no encontrado en la base de datos'})

        const token = generateToken({
            email: req.body.email
        })
    
        const resetPasswordUrl = `http://localhost:8080/reset-password-ok/${token}`
    
        await emailService.sendEmail(
            { 
                to: req.body.email, 
                subject: 'Has solicitado un Restablecimiento de contrasena', 
                html: `Para restablecer tu constrasena , haz click en el siguiente enlace <a href="${resetPasswordUrl}">enlace</a>`
        })
        res.status(202).send({token: isValidEmail})
    } catch (error) {
        res.status(404).send({error: error})
    }
})

route.post('/reset-password-ok/:token', async (req, res) => {
    try {
        const password = req.body.password
        const {email} = verifyToken(req.params.token)
        const findUser = await usersService.findByEmail(email)

        if(isValidPassword(password, findUser.password)){
            res.status(404).send({error: 'Ocurrio un error con la password ingresada, ingrese una diferente'})
        }else{
            const passwordHashed = createHash(password)
            const userUpdate = await usersService.changePassword(passwordHashed, email)
            console.log(userUpdate)
            res.status(202).send({success: 'Password cambiada con exito'})
        }
    } catch (error) {
        console.log(error)
        res.redirect('/password_reset')
    }
})

export default route