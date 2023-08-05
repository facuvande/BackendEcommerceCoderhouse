import express from 'express'
import viewsRoute from './routes/views.router.js'
import configureHandlebars from './lib/handlebars/hbs.middleware.js'
import routes from './routes/api.router.js'
import fileDirName from './utils/fileDirName.js'
import chatRoute from './routes/chat.route.js'
import configureSocket from './socket/configure-socket.js'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import mongoose from 'mongoose'
import passport from 'passport'
import { configurePassport } from './config/passport.config.js'
import MongoSingleton from './dao/Singleton/MongoConnection.singleton.js'
import config from './config.js'
import errorMiddleware from './config/middlewares/error.middleware.js'
import customResponseMiddleware from './config/middlewares/custom-response.middleware.js'
import spec from './docs/swagger-options.js'
import swaggerUiExpress from 'swagger-ui-express'
import initCron from './utils/cron.js'

const { __dirname } = fileDirName(import.meta)

const app = express()

/* Mongoose */
if(config.persistence === 'MONGO'){
    const mongoInstance = MongoSingleton.getInstance('MONGO')
}

/* Cookies and Sessions */
app.use(cookieParser(config.cookie_secret))
app.use(session({
    secret: config.cookie_secret,
    resave: true,
    saveUninitialized: true
}))

/* Handlebars */
configureHandlebars(app)
configurePassport();

/* Middlewares*/
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));
app.use(customResponseMiddleware)

// Node-cron
initCron();

// Rutas
//? Todo lo que son vistas
app.use('/', viewsRoute);
//? Todo lo que es de nuestra api
app.use('/api', routes)
app.use('/chat', chatRoute)
//? Documentacion
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
app.get('/apidocs-json', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
})

app.use(errorMiddleware)

// app.use((error, req, res, next) =>{
//     if(error.message){
//         return res.status(400).send({
//             message: error.message
//         })
//     }
//     res.status(500).send({error});
// })

const httpServer = app.listen(config.port, () => 
    console.log(`Servidor express escuchando en el puerto ${config.port}`)
)

configureSocket(httpServer)