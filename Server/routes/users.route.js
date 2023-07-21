import { Router } from 'express'
import usersController from '../controllers/users.controller.js'
import { validateBody, validateParams } from '../config/middlewares/validators.js'
import { validator } from '../validator/validator.js'
import { UserDto } from '../dtos/user.dtos.js'
import { Id } from '../dtos/id.param.dto.js'
import { imgsUploader } from '../utils/imgsUploader.js'

const route = Router()

// Traemos todos los usuarios
route.get('/', usersController.getAll.bind(usersController))
// Guardar usuario
route.post('/', validateBody(validator(UserDto)) ,usersController.saveUser.bind(usersController))
// Modificar rol de usuario
route.post('/premium/:id', validateParams(validator(Id)), usersController.changeRole.bind(usersController))
// Subir uno o multiples archivos
route.post('/:uid/documents', (req, res, next) => {
    req.body.fileType = 'document';
    next();
}, imgsUploader.array('file', undefined) , usersController.uploadDocuments.bind(usersController))

export default route;
