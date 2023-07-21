import { Router } from "express";
import logger from "../logger/winston-logger.js";


const route = Router();

route.get('/', (req, res) =>{
    logger.debug('Este es un mensaje de depuración'); 
    logger.info('Esta es una información');
    logger.warning('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje fatal');
    res.send('Ok')
});


export default route
