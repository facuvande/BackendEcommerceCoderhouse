import { Router } from 'express'
import usersModel from '../dao/models/users.model.js'
import passport from 'passport'
import { generateToken } from '../utils/tokenGenerate.js'
import CurrentUserDto from '../dtos/current.user.dto.js'

const route = Router()

route.get('/current', passport.authenticate('current'), async (req, res, next) =>{
    const user = req.user;
    console.log(user)
    // Validar y transformar el objeto user usando currentDto
    const validatedUser = new CurrentUserDto(user)

    res.send({user: validatedUser})
})

export default route