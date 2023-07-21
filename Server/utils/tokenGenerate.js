import config from '../config.js'
import jwt from 'jsonwebtoken'

export function generateToken(user){
    return jwt.sign(user, config.jwt_token,{
        expiresIn: '1h'
    })
}

export function verifyToken(token){
    return jwt.verify(token, config.jwt_token)
}