import { Router } from "express";
import roles from "../config/roles.js";
import { authRoute } from "../config/helpers/auth.route.js";
import CartsController from '../controllers/carts.controller.js'
import { validateParams } from "../config/middlewares/validators.js";
import { validator } from "../validator/validator.js";
import { Cid } from "../dtos/cart.dto.js";
import { Pid } from "../dtos/product.dtos.js";

const route = authRoute();

// Creamos un carrito
route.authPost('/', [roles.USER, roles.ADMIN], CartsController.create.bind(CartsController))
// Traemos carrito mediante id
route.authGet('/:cid', [roles.USER, roles.ADMIN],validateParams(validator(Cid)),CartsController.getWithId.bind(CartsController))
// Agrega producto a carrito
route.authPost('/:cid/product/:pid', [roles.USER, roles.PREMIUM], validateParams(validator(Cid)), validateParams(validator(Pid)), CartsController.addToCart.bind(CartsController))
// Borra Producto de carrito
route.authDelete('/:cid/products/:pid', [roles.USER, roles.ADMIN],validateParams(validator(Cid)), validateParams(validator(Pid)), CartsController.deleteProductToCart.bind(CartsController))
// Borra todos los productos del carrito
route.authDelete('/:cid', [roles.USER, roles.ADMIN], validateParams(validator(Cid)), CartsController.deleteAllProductToCart.bind(CartsController))
// Edita array de products del carrito
route.authPut('/:cid', [roles.USER, roles.ADMIN], validateParams(validator(Cid)), CartsController.updateProductToCart.bind(CartsController))
// Se realiza una compra
route.authPost('/:cid/purchase', [roles.USER, roles.ADMIN], validateParams(validator(Cid)), CartsController.purchase.bind(CartsController))


export default route