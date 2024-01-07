import winston from 'winston';
import config from "../config.js";

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'green'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        })
    ]
})

// const devLogger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: 'verbose'}),
//     ]
// })

// const prodLogger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: 'http'}),
//         new winston.transports.File({filename:'./errors.log', level: 'warn'})
//     ]
// })

// const allLogger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: 'silly'}),
//         new winston.transports.File({filename:'./allLogs.log', level: 'silly'})
//     ]
// })


export const addLogger = (req, res, next) => {
     if (config.logging == 'dev') {
        req.logger = devLogger;
     } else {
         req.logger = prodLogger;
     }
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}