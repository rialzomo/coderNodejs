import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
export const __typeIdentificacion= 0;
export const __typeDomicilio= 1;
export const __typeCuenta= 2;
export const __typeProfile= 3;
export const __typeProducts= 4;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(req.body.type == __typeIdentificacion || req.body.type == __typeDomicilio || req.body.type == __typeCuenta){
            cb(null, `${__dirname}/public/images/documents`)
        }
        if(req.body.type == __typeProfile){
            cb(null, `${__dirname}/public/images/profile`)
        }
        if(req.body.type == __typeProducts){
            cb(null, `${__dirname}/public/images/products`)
        }
        cb(null, `${__dirname}/public/images`)
    },
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, `${Date.now()}---${file.originalname}`)
    }
})

export const createHash = (password) => bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export default __dirname;


export const getUserToken = (authHeaders) => {
    console.log("token: "+authHeaders)
    const token = authHeaders.split(" ")[1];
    let user = jwt.verify(token, 'coderSecret');

    return user;
}

export const uploader = multer({storage})