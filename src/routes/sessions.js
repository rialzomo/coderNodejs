import { Router } from "express";
import { userModel } from "../dao/models/user.js";
import { createHash, isValidPassword } from "../utils.js";
import UserManager from "../dao/managers/UsersManager.js";

import passport from "passport";
import jwt from 'jsonwebtoken';

const usersManager = new UserManager();
const router = Router();

/*router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, password })
    if (!user) return res.status(401).send({ status: "error", error: "Email incorrecto" });

    if (!isValidPassword(user, password)) {
        return res.status(401).send({ status: 'error', error: 'Contraseña incorrecta' })
    }
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol: user.rol
    }
    res.send({ status: "success", payload: req.session.user })
})*/

router.get  ('/current', async (req, res) => {
    res.send({status: "success", payload: req.session.user})
})

router.post  ('/logout', async (req, res) => {
    usersManager.updateLastConection(req.session.user);
    req.session.destroy();
    res.send({ status: "success"})
})

/*router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) {
        return res.status(400).send({ status: "error", error: "Ya existe usuario con ese email" });
    };
    let rol;
    console.log("pass: " + password)
    console.log("pass: " + email)
    //el pass podemos hashear y cosas asi pero no nos pide eso
    if(email == "adminCoder@coder.com" && password == "adminCod3r123"){
        rol = "admin";
    }else{
        rol="usuario"
    }
    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password:createHash(password), 
        rol
    };
    let result = await userModel.create(user);
    res.send({status:"success", message: "User registered"})
})*/
router.get('/github', passport.authenticate('github', {scope: ['user:email']}) ,async (req, res) => {})

router.get('/githubCallback', passport.authenticate('github', {failureRedirect:'/loginFailed'}) ,async (req, res) => {
    req.session.user = {
        name: `${req.user.first_name}`,
        email: req.user.userName
    }
    res.redirect('/products')
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/failLogin'}) ,async (req, res) => {
    console.log("entrada: " + req.user)
    if (!req.user) {
        return res.status(400).send({status: "error", error: "Credenciales invalidas"});
    }
    req.session.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol,
        cartId: req.user.carts[0]._id
    }
    let token = jwt.sign(req.session.user, 'coderSecret');
    console.log("token: " + token)
    req.session.token=token;
    //userManager.updateLastConection(req.session.user);
    res.send({status: "success", payload: req.session})
})
router.get('/failLogin', (req,res)=> {
    res.send({error: "Failed login"})
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister'}) ,async (req, res) => {
    res.send({status: "success", message: "Usuario registrado"})
})

router.get('/failRegister', async(req, res)=> {
    console.log("Fallo la estrategia");
    res.send({error:"Failed register"});
})

export default router;