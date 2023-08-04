import { Router } from 'express'
import usersController from '../controllers/users.controller.js'
import { validateBody, validateParams } from '../config/middlewares/validators.js'
import { validator } from '../validator/validator.js'
import { UserDto } from '../dtos/user.dtos.js'
import { Id } from '../dtos/id.param.dto.js'
import { imgsUploader } from '../utils/imgsUploader.js'
import { authRoute } from '../config/helpers/auth.route.js'
import roles from '../config/roles.js'

const route = authRoute();

// Traemos todos los usuarios
route.authGet('/', [roles.ADMIN, roles.USER], usersController.getAll.bind(usersController))
// Traemos un solo usuario
route.authGet('/:email', [roles.ADMIN], usersController.getOne.bind(usersController))
// Eliminar usuario
route.authDelete('/:id', [roles.ADMIN], validateParams(validator(Id)), usersController.deleteUser.bind(usersController))
// Guardar usuario
route.authPost('/', [roles.ADMIN, roles.USER], validateBody(validator(UserDto)) ,usersController.saveUser.bind(usersController))
// Modificar rol de usuario
route.authPost('/premium/:id',[roles.ADMIN], validateParams(validator(Id)), usersController.changeRole.bind(usersController))
// Subir imagen de perfil
route.authPost('/updateProfile', [roles.ADMIN, roles.USER], (req, res, next) => {
    req.fileType = 'profile';
    next();
}, imgsUploader.array('file', undefined), usersController.uploadProfile.bind(usersController))
// Subir uno o multiples archivos
route.authPost('/:uid/documents', [roles.ADMIN, roles.USER], (req, res, next) => {
    req.fileType = 'document';
    next();
}, imgsUploader.array('file', undefined) , usersController.uploadDocuments.bind(usersController))

export default route;
