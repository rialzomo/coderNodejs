import { Router } from 'express';
import ProductsManager from "../dao/managers/ProductsManager.js";
import CartsManager from "../dao/managers/CartsManager.js";
import RouterCustom from "./router.js";

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

const router = Router();

export default class ViewsRouter extends RouterCustom {
    init() {
        const publicAccess = (req, res, next) => {
            if (req.session.user) return res.redirect('/products');
            next();
        }
        
        const privateAccess = (req, res, next) => {
            if (!req.session.user) {
                return res.redirect('/login');
            }
            next();
        }
        
        this.getCustom('/login',  ["PUBLIC"], (req, res)=> {
            res.render('login');
        })
        
        this.getCustom('/register',  ["PUBLIC"], (req, res)=> {
            res.render('register')
        })
        
        this.getCustom('/profile',  ["USER", "ADMIN"], (req, res)=> {
            res.render('profile', {
                user: req.session.user,
            })
        })

        this.getCustom('/compra',  ["PUBLIC"], (req, res)=> {
            res.render('compra', {
                user: req.session.user,
            })
        })
        
        this.getCustom('/',  ["PUBLIC"],async(req, res) => {
            req.logger.info("get: /");
            const products = await productsManager.getAll();
            res.render('home',{products});
            
        })
        
        this.getCustom('/products',  ["PUBLIC", "ADMIN"],async(req, res) => {
            req.logger.info("get: /products");
            const data = await productsManager.getPaginated(req.query.limit, req.query.page, req.query.sort, req.query.query, req.query.price, req.query.category);
            let flagRol = false;
            req.logger.info("user: " + req.session.user)
            if(req.session.user.rol == "admin"){
                flagRol = true;
            }
            req.logger.debug("token: " + req.session.token)
            req.logger.debug("id: " + req.session.user.cartId)
            res.render('products',{payload:data.docs, totalPages: data.totalPages, prevPage: data.prevPage, nextPage: data.nextPage, page: data.page, hasPrevPage: data.hasPrevPage, hasNextPage: data.hasNextPage, name:req.session.user.name, email:req.session.user.email, flagRol:flagRol, cartId:req.session.user.cartId, token:req.session.token, req:req});
            
        })
        
        //this.getCustom('/carts/:cid', ["USER", "ADMIN"],async(req,res)=>{
        this.getCustom('/carts/:cid', ["PUBLIC"],async(req,res)=>{
            req.logger.info("get: /carts");
            const carts = await cartsManager.getByID(req.params.cid);
            let cart;
            let products=[];
            console.log("token: " + req.session.token)
            for (const product of carts.products) {  
                let data = {id:product.productId._id,
                            title:product.productId.title,
                            description:product.productId.description,
                            price:product.productId.price,
                            quantity:product.quantity
                            }
                console.log(`data: ${data}`)
                products.push(data);
            }
        
            res.render('cart',{id:carts._id, token:req.session.token, products:products});
            
        })
        
        this.getCustom('/realtimeproducts',  ["PUBLIC"],(req, res) => {
            req.logger.info("get: /realtimeproducts");
            res.render('realTimeProducts',{});
            
        })
        
        this.getCustom('/chat',  ["USER"],(req, res) => {
            res.render('chat', {});
        })
    }
}

