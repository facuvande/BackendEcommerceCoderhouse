import winston from 'winston'
import config from '../config.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    }
}

let logger;

// Si estamos en desarrollo
if (config.node_env !== 'PRODUCTION') {
    logger = winston.createLogger({
    // nivel maximo a loggear
    level: 'debug',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    // Hora actual
    timestamp: true,
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
    ]
})
}else{
    logger = winston.createLogger({
    // nivel maximo a loggear
    level: 'info',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    // Hora actual
    timestamp: true,
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename: './log/error.log',
            level: 'error',
        }),
    ]
})
}

export default logger