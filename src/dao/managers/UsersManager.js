import { __typeProducts, __typeProfile,  __typeCuenta, __typeDomicilio, __typeIdentificacion} from "../../utils.js";
import { userModel } from "../models/user.js";


export default class UserManager {
    constructor() {
    }

    changeRol = async (idUser) => {
        const result = await userModel.findOne({ _id: idUser });
        if(result.verificacionIdentificacion && result.verificacionDomicilio && result.verificacionCuenta){
            if(result.rol.toUpperCase() == "USER"){
                result.rol = "premium";
            }else{
                result.rol = "user";
            }
            const resultChange = await userModel.findOneAndUpdate({ _id: idUser }, result);
            console.log ("UserManager - [changeRol] - result: " + resultChange);
            return resultChange;
        }else{
            throw new Error(`Para ser PREMIUM necesita actulizar los documentos requeridos`);  
        }

        
    }
    
    getAll = async () => {
        const users = await userModel.find();
        //console.log("cantidad: "+ users)
        const usersFilter = [];
        users.forEach(async user => {
            let userFilter = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "rol": user.rol,
            };
            console.log("usuario: " + userFilter.first_name)
            usersFilter.push(userFilter);
        });
        console.log("cantidad filters: "+ usersFilter.length)
        return usersFilter;
    }

    getById = async (idUser) => {
        const user = await userModel.findOne({ _id: idUser });
      
        return user;
    }

    deleteById = async (idUser) => {
        const user = await userModel.deleteOne({ _id: idUser });
      
        return user;
    }

    deleteAllLimitTime = async () => {
        const users = await userModel.find();
        users.forEach(async user => {
            const actual = new Date();
            let dosDiasMilis = 24*60*60*1000*2;
            let fechaLimite = new Date(actual.getTime() - dosDiasMilis);
            if(user.last_conection != null && user.last_conection != undefined){
                if(user.last_conection.getTime() < fechaLimite.getTime()){
                    await userModel.deleteOne({ _id: user._id });
                }
            }
            
            
        });
    }

    updateLastConection = async (user) => {
        let filter = { email: user.email };
        const userBD = await userModel.findOne(filter);
        userBD.last_conection = Date.now();
        const result =userModel.updateOne({ _id: userBD._id }, userBD);
        return result;
    }

    images = async (name, typeImg, idUser) => {
        let filter = { _id: idUser };
        const userBD = await userModel.findOne(filter);
        let urlImg = "";
        //podria ser un switch pero ya no tengo ganas de cambiar
        if(typeImg == __typeIdentificacion &&  !userBD.verificacionIdentificacion){
            userBD.verificacionIdentificacion = true;
            urlImg = `/public/images/documents/${req.file.filename}`;
        }else if(typeImg == __typeDomicilio &&  !verificacionDomicilio){
            userBD.verificacionDomicilio = true;
            urlImg = `/public/images/documents/${req.file.filename}`;
        }else if(typeImg == __typeCuenta &&  !verificacionCuenta){
            userBD.verificacionCuenta = true;
            urlImg = `/public/images/documents/${req.file.filename}`;
        }else if(typeImg == __typeProfile){
            userBD.verificacionCuenta = true;
            urlImg = `/public/images/profile/${req.file.filename}`;
        }else if(typeImg == __typeProducts){
            userBD.verificacionCuenta = true;
            urlImg = `/public/images/products/${req.file.filename}`;
        }else{
            throw new Error(`Se necesita un tipo valido`);  
        }

        let doc = new userDocuments(name, urlImg, typeImg, true);
        userBD.documents.push(doc);
        const result =userModel.updateOne(filter, userBD);
        return result;
    }

}

class userDocuments{
    constructor(name, reference,type,status=false){
        this.name = name;
        this.reference = reference;
        this.type = type;
        this.status = status;
    }
}