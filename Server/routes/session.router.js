import { Router } from 'express'
import passport from 'passport'
import CurrentUserDto from '../dtos/current.user.dto.js'

const route = Router()

route.get('/current', passport.authenticate('current'), async (req, res, next) =>{
    const user = req.user;
    // Validar y transformar el objeto user usando currentDto
    const validatedUser = new CurrentUserDto(user)

    res.send({user: validatedUser})
})

export default route