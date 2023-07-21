import { Router } from "express";
import productRoute from './products.route.js'
import usersRoute from './users.route.js'
import cartRoute from './carts.route.js'
import authRouter from './auth.router.js'
import sessionRouter from './session.router.js'
import mockingProductsRoute from './mockingproducts.router.js'
import loggerTestRoute from './loggerTest.router.js'

const route = Router()

route.use('/products', productRoute)
route.use('/users', usersRoute)
route.use('/carts', cartRoute)
route.use('/auth', authRouter)
route.use('/sessions', sessionRouter)
route.use('/mockingproducts', mockingProductsRoute)
route.use('/loggerTest', loggerTestRoute)

export default route;