import CartsManager from "../dao/managers/CartsManager.js";
import RouterCustom from "./router.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { getUserToken } from "../utils.js";
import { generatePIDCIDtErrorInfo, generateDeleteCartErrorInfo, generateUpdateCartErrorInfo } from "../errors/info.js";

const cartsManager = new CartsManager();

export default class CartsRouter extends RouterCustom {
    init() {
        this.getCustom('/', ["PUBLIC"],async(req,res)=>{
            req.logger.info("[Carts] - get: /");
            try {
                const carts = await cartsManager.getAll();
                res.send(carts)
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });
        
        //this.getCustom('/:cid', ["USER", "ADMIN"], async(req,res)=>{
        this.getCustom('/:cid', ["PUBLIC"], async(req,res)=>{
            req.logger.info("[Carts] -get: /:cid");
            console.log("parametro: " + req.params.cid)
            try {
                const carts = await cartsManager.getByID(req.params.cid);
                res.send(carts)
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });
        
        this.postCustom('/', ["USER"], async(req, res) => {
            req.logger.info("[Carts] -post: /");
            try {
                const carts = await cartsManager.saveCart(req.body);
            res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                res.send({status: "failed", description: error.message});
            }
            
        })
        
        //this.postCustom('/:cid/product/:pid', ["USER", "PREMIUM","ADMIN"], async (req, res) => {
        this.postCustom('/:cid/product/:pid', ["PUBLIC"], async (req, res) => {
            req.logger.info("[Carts] - post: /:cid/product/:pid");
            try {
                let user = getUserToken(req.headers.authorization);
                await cartsManager.addProductToCart(req.params.cid,req.params.pid, user.email);
                res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Add Product to Cart error',
                    cause: generatePIDCIDtErrorInfo(req.params.pid, req.params.cid),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.send({status: "failed", description: error.message});
            }
        })
        
        this.deleteCustom('/:cid/product/:pid', ["USER", "ADMIN"], async(req, res) => {
            req.logger.info("[Carts] - delete: /:cid/product/:pid");
            try {
                await cartsManager.deleteProductToCart(req.params.cid,req.params.pid);
                res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Delete Product to cart error',
                    cause: generatePIDCIDtErrorInfo(req.params.pid, req.params.cid),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.send({status: "failed", description: error.message});
            }
        })
        
        this.putCustom('/:cid', ["USER", "ADMIN"], async (req, res) => {
            req.logger.info("[Carts] - put: /:cid");
            try {
                await cartsManager.updateProductsToCart(req.params.cid,req.body);
                res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Update cart error',
                    cause: generateUpdateCartErrorInfo(),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.send({status: "failed", description: error.message});
            }
        })
        
        this.putCustom('/:cid/product/:pid', ["USER", "ADMIN"],async(req, res) => {
            req.logger.info("[Carts] - put: /:cid/product/:pid");
            try {
                await cartsManager.updateQuantityProductToCart(req.params.cid,req.params.pid,req.body.quantity);
                res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Update Quantity Product to Cart error',
                    cause: generatePIDCIDtErrorInfo(req.params.pid, req.params.cid),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.send({status: "failed", description: error.message});
            }
        })
        
        this.deleteCustom('/:cid', ["ADMIN"],async(req, res) => {
            req.logger.info("[Carts] - delete: /:cid");
            try {
                await cartsManager.deleteProductsToCart(req.params.cid);
                console.log("sali bien")
                res.send({status: 'success'})
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Delete cart error',
                    cause: generateDeleteCartErrorInfo(req.params.cid,req.params.pid),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.send({status: "failed", description: error.message});
            }
        })
        
        this.postCustom('/:cid/purcharse', ["USER", "ADMIN"],(req, res) => {
            req.logger.info("[Carts] - post: /:cid/purcharse/");
            try {
                let user = getUserToken(req.headers.authorization);
                const result = cartsManager.buyProductToCard(req.params.cid, user.email);
                console.log("resultado: " + result)
                res.send({status: 'success',payload:result})
            } catch (error) {
                req.logger.error("Error: " + error);
                res.send({status: "failed", description: error.message});
            }
        })
    }
}

