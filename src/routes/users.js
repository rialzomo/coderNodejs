import UsersManager from "../dao/managers/UsersManager.js";
import RouterCustom from "./router.js";
import { uploader } from "../utils.js";

const usersManager = new UsersManager();
export default class UsersRouter extends RouterCustom {
    init() {
        
        this.getCustom('/premium/:uid', ["USER", "PREMIUM","ADMIN"],async(req,res)=>{
            req.logger.info("[Users] - get: premium/:uid");
            try {
                const user = await usersManager.changeRol(req.params.uid);
                res.send("OK");
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });

        this.postCustom('/:uid/documents', uploader.single('thumbnail'), (req, res) => {
            usersManager.images(req.file.filename, req.body.type,req.params.uid);
            res.send({status: 'success'})
        });

        this.getCustom('/', ["ADMIN"], async(req, res) => {
            const users = await usersManager.getAll();
            console.log("usuarios: " + users)
            res.send({status: 'success', payload:users});
            //res.render('user',{users});
        });

        this.getCustom('/', ["ADMIN"], async(req, res) => {
            const users = await usersManager.getAll();
            console.log("usuarios: " + users)
            res.send({status: 'success', payload:users});
            //res.render('user',{users});
        });

        this.getCustom('/:uid', ["ADMIN"],async(req,res)=>{
            req.logger.info("[Users] - get: /:uid");
            try {
                const user = await usersManager.getById(req.params.uid);
                res.render('users',{firts_name:user.firts_name, last_name:user.last_name, email:user.email, rol:user.rol, _id:user._id,token:req.session.token});
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });

        this.deleteCustom('/:uid', ["ADMIN"],async(req,res)=>{
            req.logger.info("[Users] - delete: /:uid");
            try {
                const user = await usersManager.deleteById(req.params.uid);
                res.send({status: 'success'});
            } catch (error) {
                req.logger.error("Error: " + error);
                res.status(500).send({status:"failed", description: error.message});
            }
            
        });

        this.deleteCustom('/', ["ADMIN"], async(req, res) => {
            await usersManager.deleteAllLimitTime();
            res.send({status: 'success'});
        });
    }
}