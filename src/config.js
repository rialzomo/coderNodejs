import {Command} from 'commander';
import dotenv from 'dotenv';

const program = new Command();

program
    .option('--mode <modo>', 'Entorno de trabajo', 'stage')
    .option('--prod', 'Entorno de trabajo', false)

program.parse();


// const environment = program.opts().mode;

// dotenv.config({
//     path: environment === 'production' ? './.env.production' : './.env.development'
// })

const environment = program.opts().prod;
console.log("este es: " + environment)
dotenv.config({
    path: environment ? './env.production' : './env.development'
})

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    admin: process.env.ADMIN,

}