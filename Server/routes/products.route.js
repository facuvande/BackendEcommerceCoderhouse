import { imgsUploader } from "../utils/imgsUploader.js";
import { authRoute } from "../config/helpers/auth.route.js";
import roles from '../config/roles.js'
import ProductsController from '../controllers/products.controller.js'
import { Pid } from "../dtos/product.dtos.js";
import { validateParams } from "../config/middlewares/validators.js";
import { validator } from "../validator/validator.js";

const route = authRoute();

// Traemos todos los productos
route.authGet('/', [roles.USER, roles.ADMIN], ProductsController.getAll.bind(ProductsController))
// Traemos solo por id
route.authGet('/:pid', [roles.USER, roles.ADMIN], validateParams(validator(Pid)), ProductsController.getWithId.bind(ProductsController))
// Guardar producto
route.authPost('/', [roles.PREMIUM, roles.ADMIN] , (req , res , next) => {
    req.fileType = 'product' 
    next();
},imgsUploader.array('file', undefined),  ProductsController.save.bind(ProductsController))
// Actualizar Producto
route.authPut('/:pid', [roles.PREMIUM, roles.ADMIN], validateParams(validator(Pid)),ProductsController.editProduct.bind(ProductsController));
// Eliminar Producto
route.authDelete('/:pid', [roles.ADMIN, roles.PREMIUM] , validateParams(validator(Pid)), ProductsController.deleteProduct.bind(ProductsController))


export default route;