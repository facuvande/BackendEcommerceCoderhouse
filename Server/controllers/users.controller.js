import UsersFactory from "../dao/Factorys/users.factory.js";
import UserRepository from "../repository/user.repository.js";
import CartsFactory from "../dao/Factorys/carts.factory.js";
import CartRepository from "../repository/carts.repository.js";
import { createHash } from "../utils/crypto.js";
import { emailService } from "../external-services/email.service.js";
import config from "../config.js";
import logger from "../logger/winston-logger.js";


const Users = await UsersFactory.getDao()
const usersService = new UserRepository(new Users)

const Carts = await CartsFactory.getDao()
const cartsService = new CartRepository(new Carts)

class UsersController{
    #service;
    #cartsService
    constructor(service, cartsService){
        this.#service = service;
        this.#cartsService = cartsService
    }

    async getAll(req, res, next){
        try {
            const users = await this.#service.getAll()
            res.send(users)
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async getOne(req, res, next){
        try {
            const email = req.params.email

            const user = await this.#service.getOne(email);
            if(user){
                res.status(202).send(user)
            }else{
                res.status(400).send({error: 'Usuario no encontrado'})
            }
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async saveUser(req, res, next){
        const user = req.body

        try {
            console.log('viene1')
            if(user.email == config.admin_email){
            console.log('viene2')
                return res.status(400).send({error: 'El email se encuentra registrado'})
            }

            console.log('viene3')

            const userExists = await this.#service.findByEmail(user.email)
            console.log(userExists)
            console.log('viene4')

            if(userExists){
            console.log('viene5')

                return res.status(409).send({error: "El email se encuentra registrado"})
            }

            const createCart = await this.#cartsService.create()

            user.cart = createCart
            user.password = createHash(user.password)
            const id = await this.#service.saveUser(user)

            await emailService.sendEmail({ to: user.email, subject: 'Bienvenido a Backend Coderhouse', html: 'Te damos la bienvenida a nuestro sitio'})
            res.status(201).send({ id: id })
        } catch (error) {
            logger.error(`Error - ${req.method} - ${error}`)
            next(error)
        }
    }

    async changeRole(req, res, next){
        try {
            const id = req.params.id
            const userExists = await this.#service.findById(id)
            if(userExists){
                if(userExists.role == 'USER'){
                    const areDocumentsUploaded = await this.#service.areDocumentsUploaded(userExists) // true || false
                    if(!areDocumentsUploaded){
                        return res.status(400).send({error: 'El usuario no ha subido los documentos requeridos'})
                    }
                }
                
                const change = await this.#service.changeRole(userExists.email)
                res.status(202).send({success: `Ahora cuentas con el rol ${change}`})
            }else{
                res.status(400).send({error: 'Usuario inexistente'})
            }
        } catch (error) {
            console.log(error)
            res.send({error: 'error'})
        }
    }

    async uploadDocuments(req, res, next){
        try {
            const userId = req.params.uid;
            const documents = req.files;
            const description = req.headers['description']; // Identification, comprobante-domicilio, comprobante-estado-cuenta

            const userExists = await this.#service.findById(userId);
            if(userExists){
                const uploadDocuments = await this.#service.uploadDocuments(userId, documents, description);

                res.status(202).send({success: `Documentos subidos correctamente`});
            }else{
                res.status(400).send({error: 'Usuario inexistente'});
            }
        } catch (error) {
            console.log(error);
            res.send({error: 'error'});
        }
    }

    async uploadProfile(req, res, next){
        try {
            const { email } = req.user;
            const { firstName, lastName } = req.body;
            const file = req.files[0]

            const updateUser = await this.#service.uploadProfile(email, { firstName, lastName, file: file?.filename });
            res.status(202).send({success: 'User actualizado correctamente'})
        } catch (error) {
            console.log(error)
            res.send({error: 'error'});
        }
    }

    async deleteUser(req, res, next){
        try {
            const id = req.params.id
            const deleteUser = await this.#service.deleteUser(id)

            return deleteUser ? res.status(202).send({success: 'Usuario eliminado correctamente'}) : res.status(400).send({error: 'Usuario inexistente'})
        } catch (error) {
            console.log(error)
            res.send({error: 'error'});
        }
    }

    async deleteInactiveUsers(req, res, next){
        try {
            const deleteInactive = await this.#service.deleteInactiveUsers()
            console.log(deleteInactive);

            return res.status(202).send({success: 'Usuarios inactivos eliminados correctamente'})
        } catch (error) {
            console.log(error);
            res.send({error: 'error'})
        }
    }
}

const controller = new UsersController(usersService, cartsService);
export default controller

