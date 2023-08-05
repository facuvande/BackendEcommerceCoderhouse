import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import usersModel from "../../dao/models/users.model.js";
import config from "../../config.js";
import CartsFactory from "../../dao/Factorys/carts.factory.js";


const Carts = await CartsFactory.getDao()
const CartService = new Carts()


export function githubStrategy(){
    passport.use('github', new GithubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: config.github_callback_url,
    }, async(accessToken, refreshToken, profile, done) =>{
        try {
            const email = profile._json.email;
            const user = await usersModel.findOne({email});
            if(!user){

                const cartCreate = await CartService.create()
                const newUser = await usersModel.create({
                    email,
                    firstName: profile._json.name,
                    lastName: '-',
                    password: '-',
                    age: 18,
                    cart: cartCreate,
                    role: 'USER',
                })
                return done(null, newUser)
            }
            
            return done(null, user)
        } catch (error) {
            done(error, false)
        }
    }))
}