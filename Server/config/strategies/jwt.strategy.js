import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../../config.js";

export function jwtStrategy(){
    passport.use('current', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt_token,
        ignoreExpiration: false,
    }, (payload, done) =>{
        try {
            return done(null, payload)
        } catch (error) {
            done(error)
        }
    }))
}

function cookieExtractor(req){
    return req?.cookies?.['current']
}

