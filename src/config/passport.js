import passport from "passport";
import local from "passport-local"
import { userModel } from "../dao/models/user.js"
import { createHash, isValidPassword } from '../utils.js'
import gitHubStrategy from "passport-github2"
import CartsManager from "../dao/managers/CartsManager.js";
import UserManager from "../dao/managers/UsersManager.js";
import { cartsModel } from "../dao/models/carts.js";
import config from "../config.js";

const cartsManager = new CartsManager();
const usersManager = new UserManager();

const LocalStrategy = local.Strategy;
const GitHubStrategy = gitHubStrategy.Strategy;
export const initializePassport = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const exists = await userModel.findOne({ email });
            if (exists) {
                console.log('El usuario ya existe')
                return done(null, false);
            };
            let rol;

            if(email == config.adminEmail && password == config.adminPassword){
                rol = "admin";
            }else{
                rol="user"
            }
            let resultCart = await cartsManager.saveCart();
            const newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password:createHash(password), 
                rol,
                cart:resultCart._id
            };
            let result = await userModel.create(newUser);
            return done(null, result)
        } catch (error) {
            return done('Error al crear el usuario:' + error)
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({email: username});
            console.log("usuario: " +  user)
            if (!user) {
                console.log("No existe el usuario")
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }
            usersManager.updateLastConection(user);
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.a08e59c2a065ecb8",
        clientSecret: "a454e041f0e46ef008c6cda7fc8dc0254dc306fb",
        callBackURL: "http://localhost:8080/api/sessions/githubCallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({ userName: profile._json.login})
            if (!user) {
                let newUser = { first_name: profile._json.name, userName: profile._json.login }
                let result = await userModel.create(newUser);
                return done(null, result);
            }
            done(null, user)
        } catch (error) {
            return done(error)
        }
    }));

    passport.serializeUser((user,done)=> {
        done(null, user._id)
    })

    passport.deserializeUser(async (id,done) => {
        let user = await userModel.findById(id);
        done(null,user);
    })
}