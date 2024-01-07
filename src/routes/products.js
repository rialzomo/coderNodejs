import ProductsManager from "../dao/managers/ProductsManager.js";
import RouterCustom from "./router.js";
import CustomError from "../errors/CustomError.js";
import EErrors from "../errors/enums.js";
import { getUserToken } from "../utils.js";
import { generateDeleteProductErrorInfo, generateAddProductErrorInfo} from "../errors/info.js";

const productsManager = new ProductsManager();
export default class ProductsRouter extends RouterCustom {
    init() {
        this.getCustom('/', ["USER"], async(req, res) => {
            req.logger.info("[Product] - get: /");
            try {
                let user = getUserToken(req.headers.authorization);
                const data= await productsManager.getPaginated(req.query.limit, req.query.page, req.query.sort, req.query.query, req.query.price, req.query.category);
                let flagRol = false;
                if(user.rol == "admin"){
                    flagRol = true;
                }
                res.send({status:"success",payload:data.docs, totalPages: data.totalPages, prevPage: data.prevPage, nextPage: data.nextPage, page: data.page, hasPrevPage: data.hasPrevPage, hasNextPage: data.hasNextPage,  name:user.name, email:user.email, flagRol:flagRol,cartId:user.cartId});
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
            
        });
        
        this.getCustom('/:pid', ["PUBLIC"],async(req,res)=>{
            req.logger.info("[Product] - get: /:pid");
            try {
                const product = await productsManager.getByID(req.params.pid);
                res.send(product);
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });

        this.putCustom('/:pid', ["ADMIN","PREMIUM"],async(req, res) => {
            req.logger.info("[Product] - put: /:pid");
            const io = req.app.locals.socketio;
            try {
                let user = getUserToken(req.headers.authorization);
                let products = await productsManager.updateById(req.params.pid,req.body, user);
                io.emit('product', products);
                res.send(products);
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
        });

        this.deleteCustom('/:pid', ["ADMIN","PREMIUM"],async(req, res) => {
            req.logger.info("[Product] - delete: /:pid");
            const io = req.app.locals.socketio;
            try {
                let user = getUserToken(req.headers.authorization);
                let products = await productsManager.deleteById(req.params.pid, user);
                io.emit('product', products);
                res.send(products);
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Delete Product error',
                    cause: generateDeleteProductErrorInfo(req.params.pid),
                    message: error.message,
                    code: EErrors.INVALID_PARAM_ERROR
                })
                //res.status(500).send({status:"failed", description: error.message});
            }
            
        });

        this.postCustom('/', ["ADMIN","PREMIUM"],async(req, res) => {
            req.logger.info("[Product] - post: /");
            const io = req.app.locals.socketio;
            try {
                const product = req.body;
                let products = await productsManager.saveProduct(product);
                io.emit('product', products);
                res.send(products);
            } catch (error) {
                req.logger.error("Error: " + error);
                CustomError.createError({
                    name: 'Add Product error',
                    cause: generateAddProductErrorInfo(),
                    message: error.message,
                    code: EErrors.DATABASE_ERROR
                })
                //res.status(500).send({status:"failed", description: error.message});
            }
        })
    }
}