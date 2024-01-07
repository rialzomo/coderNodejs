import { productsModel } from "../models/products.js";
import MailManager from "./MailManager.js";

const mailManager = new MailManager();

export default class ProductsManager {
    constructor() {
    }

    getAll = async () => {
        const result = await productsModel.find();
        console.log ("[ProductsManager - getAll] - result: " + result);
        return result.map(data => data.toObject());
    }

    getPaginated = async (limit, page, sortparam, query, filtroPrice, filtroCategory) => {
        let sortNumber=0;

        if(limit == undefined || limit <= 0 || limit == null){
            limit = 10;
        }
        
        if(page == undefined|| page <= 0 || page == null){
            page = 1;
        }
        if(sortparam == undefined){
            sortNumber = 0;
        }else if (sortparam === 'asc'){
            sortNumber = 1;
        }else{
            sortNumber = -1;
        }
        let filtros = {};
        if(query =='price'){
            filtros = {
                price:filtroPrice
            };
        }
        if(query=='categoty'){
            filtros = {
                category:filtroCategory
            };
        }
        const options = {
            page: page,
            limit: limit,
            sort:{price: sortNumber}
        };
        
        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage, prevLink, nextLink } = await productsModel.paginate(filtros, options);
        const data = {
            docs :docs.map(doc=> doc.toObject()),
            totalPages : totalPages,
            prevPage : prevPage,
            nextPage : nextPage,
            hasPrevPage : hasPrevPage,
            hasNextPage : hasNextPage,
            prevLink : prevLink,
            nextLink : nextLink
        }
        return data;
    }

    getLimit = async (limit) => {
        const products = await productsModel.find().limit(limit);
        console.log ("ProductsManager - getLimit: " + products);
        return products.map(product => product.toObject());
    }

    getByID = async (idProduct) => {
        const result = await productsModel.findOne({ _id: idProduct });
        console.log ("[ProductsManager - getByID] - result: " + result);
        return result;
    }

    deleteById = async(idProduct, user) => {
       
        let filter = { _id: idProduct };
        let resultGet = await productsModel.findOne({ _id: idProduct });
        if(user.rol.toUpperCase() == "PREMIUM"){
            if(resultGet == undefined){
                throw new Error(`ID de Producto Inexistente`);
            }
            if(user.email.toUpperCase() != resultGet.owner.toUpperCase()){
                throw new Error(`Usuario No es owner del producto`);
            }
        }

        let result = await productsModel.deleteOne({ _id: idProduct });
        console.log("rol: " + user.rol)
        if(user.rol.toUpperCase() == "ADMIN"){
            this.enviarMail(resultGet.owner, idProduct);
        }
        //console.log ("[ProductsManager - deleteById] - result: " + result);
        return this.getAll();
    }

    enviarMail = async(email, idProduct) => {
        mailManager.sendMailProduct(email, idProduct);
    }

    updateById = async(idProduct, product, user) => {
        if(user.rol.toUpperCase() == "PREMIUM"){
            let filter = { _id: idProduct };
            let resultGet = await productsModel.findOne(filter, product);;
            if(resultGet == undefined){
                throw new Error(`ID de Producto Inexistente`);
            }
            if(user.email.toUpperCase() != resultGet.owner.toUpperCase()){
                throw new Error(`Usuario No es owner del producto`);
            }
        }

        let result = await productsModel.findOneAndUpdate(filter, product);
        console.log ("[ProductsManager - updateById] - result: " + result);
        return this.getAll(); 
    }

    saveProduct = async (product) => {
        try {
            const result = await productsModel.create(product);
            console.log ("[ProductsManager - saveProduct] - result: " + result);
            return this.getAll();
        } catch (error) {
            throw error;
        }
    }
}