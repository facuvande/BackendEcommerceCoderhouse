import passport from "passport";
import usersModel from "../dao/models/users.model.js";
import { localStrategy } from "./strategies/local.strategy.js";
import { githubStrategy } from "./strategies/github.strategy.js";
import { jwtStrategy } from "./strategies/jwt.strategy.js";
import config from "../config.js";

export function configurePassport(){
    localStrategy();
    jwtStrategy();
    githubStrategy();

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) =>{
        if(id == config.admin_email){
            const user = {
                _id: 'Adminid',
                firstName: 'Administrador',
                lastName: 'Administrador',
                email: config.admin_email,
                age: '32',
                cart: [],
                role: 'ADMIN'
            }

            return done(null, user)
        }
        const user = await usersModel.findOne({_id: id});
        done(null, user)
    })
}
