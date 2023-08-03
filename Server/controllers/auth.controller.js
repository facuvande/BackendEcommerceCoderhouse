import { generateToken } from "../utils/tokenGenerate.js";
import usersModel from "../dao/models/users.model.js";
import UsersFactory from "../dao/Factorys/users.factory.js";
import { emailService } from "../external-services/email.service.js";
import { createHash, isValidPassword } from "../utils/crypto.js";

const Users = await UsersFactory.getDao()
const UsersService = new Users()

class AuthController{
    #userService;
    #emailService;
    constructor(userservice, emailService){
        this.#userService = userservice;
        this.#emailService = emailService;
    }

    async login(req, res, next){
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
    }
    
    async logout(req, res, next){
        const user = req.user

        // Hacer que se actualice la ultima conexion 
        await usersModel.updateOne({ _id: user._id }, { $set: { last_connection: new Date() }});

        res.clearCookie('current');
        res.clearCookie('connect.sid')
        res.redirect('/login')
    }

    async register(req, res, next){
        console.log('entra')
        req.user = null;
        res.status(201).send({message: `Usuario Creado`})
    }

    async githubCallback(req, res, next){
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
    }

    async resetPassword(req, res, next){
        try {
            console.log(req.body.email)
    
            const isValidEmail = await this.#userService.findByEmail(req.body.email)
            console.log(isValidEmail)
            if(!isValidEmail) return res.status(404).send({error: 'Email no encontrado en la base de datos'})
    
            const token = generateToken({
                email: req.body.email
            })
        
            const resetPasswordUrl = `http://localhost:8080/reset-password-ok/${token}`
        
            await this.#emailService.sendEmail(
                { 
                    to: req.body.email, 
                    subject: 'Has solicitado un Restablecimiento de contrasena', 
                    html: `Para restablecer tu constrasena , haz click en el siguiente enlace <a href="${resetPasswordUrl}">enlace</a>`
            })
            res.status(202).send({token: isValidEmail})
        } catch (error) {
            res.status(404).send({error: error})
        }
    }

    async resetPasswordOk(req, res, next){
        try {
            const password = req.body.password
            const {email} = verifyToken(req.params.token)
            const findUser = await this.#userService.findByEmail(email)

            if(isValidPassword(password, findUser.password)){
                res.status(404).send({error: 'Ocurrio un error con la password ingresada, ingrese una diferente'})
            }else{
                const passwordHashed = createHash(password)
                const userUpdate = await this.#userService.changePassword(passwordHashed, email)

                res.status(202).send({success: 'Password cambiada con exito'})
            }
        } catch (error) {
            res.redirect('/password_reset')
        }
    }
}

const controller = new AuthController(UsersService, emailService);
export default controller

