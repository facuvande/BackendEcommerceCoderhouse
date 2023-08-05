import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import usersModel from "../../dao/models/users.model.js";
import CartsFactory from "../../dao/Factorys/carts.factory.js";
import { createHash, isValidPassword } from "../../utils/crypto.js";
import config from "../../config.js";

const Carts = await CartsFactory.getDao()
const CartService = new Carts()

export function localStrategy(){
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async(req, username, password, done) =>{
        try {
            const { firstName, lastName, age, role, cart } = req.body
            
            if (!firstName || !lastName || !username || !password) {
                return done({ message: 'Todos los campos son obligatorios' });
            }
        
            if (!isValidEmail(username)) {
                return done({ message: 'Email no válido' });
            }
        
            if (!isValidAge(age)) {
                return done({ message: 'Edad no válida' });
            }

            if(username == config.admin_email){
                return done({message: 'El email se encuentra registrado'})
            }
            const userExists = await usersModel.findOne({email: username})

            if(userExists){
                return done({message: 'El email se encuentra registrado'});
            }
            
            const cartCreate = await CartService.create()
            
            const newUser = await usersModel.create({
                firstName, lastName, email: username, age, role, cart: cartCreate, password: createHash(password)
            })
            return done(null, newUser);
        } catch (error) {
            done(error, false)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) =>{
        try {
            if(username == config.admin_email){
                const user = {
                    _id: config.admin_email,
                    firstName: 'Administrador',
                    lastName: 'Administrador',
                    email: config.admin_email,
                    age: '32',
                    cart: [],
                    role: 'ADMIN'
                }
                return done(null, user)
            }

            const user = await usersModel.findOne({email: username})
            if(!user){
                return done(null, false)
            }

            if(!isValidPassword(password, user.password)){
                return done(null, false)
            }

            // Hacer que se actualice el ultimo login 
            await usersModel.updateOne({ _id: user._id }, { $set: { last_connection: new Date() }});

            return done(null, user)
        } catch (error) {
            done(error)
        }
    }))
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidAge(age) {
    const numericAge = parseInt(age);
    return !isNaN(numericAge) && numericAge > 0 && numericAge < 120;
}