import { cartsModel } from "../models/carts.js";
import { productsModel } from "../models/products.js";
import { ticketModel } from "../models/ticket.js";

import ProductsManager from "./ProductsManager.js";
import MailManager from "./MailManager.js";

const productsManager = new ProductsManager();
const mailManager = new MailManager();

export default class Courses {
    constructor() {
    }
    getAll = async () => {
        const result = await cartsModel.find();
        console.log ("CartsManager - [getAll] - result: " + result);
        return result;
    }

    getByID = async (idCart) => {
        const result = await cartsModel.findOne({ _id: idCart });
        console.log ("CartsManager - [getByID] - result: " + result);
        return result;
    }

    saveCart = async (carts) => {
        try {
            const result = await cartsModel.create(carts);
            console.log ("CartsManager - [saveCart] - result: " + result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    addProductToCart = async (idCart, idproduct, email) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error(`ID de Carrito Inexistente`);
            }
            const product = await productsModel.findOne({ _id: idproduct });
            if(product == undefined){
                throw new Error(`ID de Producto Inexistente`);
            }
            if(product.owner!=null && product.owner!=undefined){
                if(product.owner.toUpperCase() == email.toUpperCase()){
                    throw new Error(`Agregar Producto no Permitido: Usuario es Owner del Producto`);
                }
            }
            console.log("id producto: " + idproduct);
            console.log("array: " + cart.products);
            let position = cart.products.findIndex((element) => element.productId._id == idproduct);
            console.log("posicion: " + position)
            if(position != -1){
                
                cart.products[position] = {
                    productId: cart.products[position].productId,
                    quantity: cart.products[position].quantity + 1
                }
            }else{
                cart.products.push({
                    productId: idproduct,
                    quantity: 1
                });
            }
    
            await cartsModel.updateOne({_id: idCart}, cart);
            //le puedo restar la disponibilidad o algo asi en algun momento
            //await product.updateOne({_id: idCourse}, product);
            return this.getAll();
        } catch (error) {
            throw error;
        }

    }

    deleteProductToCart = async (idCart, idproduct) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error('ID de Carrito Inexistente');
            }
            const product = await productsModel.findOne({ _id: idproduct });
            if(product == undefined){
                throw new Error(`ID de Producto Inexistente`);
            }
            let position = cart.products.findIndex((element) => element.productId == idproduct);
            if(position != -1){
                cart.products.splice(position, 1);
            }
    
            await cartsModel.updateOne({_id: idCart}, cart);
            //le p uedo restar la disponibilidad o algo asi en algun momento
            //await product.updateOne({_id: idCourse}, product);
            return this.getAll();
        } catch (error) {
            throw error;
        }

    }

    updateProductsToCart = async (idCart, newsProducts) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error(`ID de Carrito Inexistente`);
            }
            cart.products.splice(0, cart.products.length);
            newsProducts.products.forEach(element => {
                cart.products.push(element);
            });
    
            await cartsModel.updateOne({_id: idCart}, cart);
            return this.getAll();
        } catch (error) {
            throw error;
        }

    }

    updateQuantityProductToCart = async (idCart, idproduct, newQuantity) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error(`ID de Carrito Inexistente`);
            }
            const product = await productsModel.findOne({ _id: idproduct });
            if(product == undefined){
                throw new Error(`ID de Producto Inexistente`);
            }
            let position = cart.products.findIndex((element) => element.productId == idproduct);
            if(position != -1){
                cart.products[position] = {
                    productId: cart.products[position].productId,
                    quantity: newQuantity
                }
            }
    
            await cartsModel.updateOne({_id: idCart}, cart);
            return this.getAll();
        } catch (error) {
            throw error;
        }

    }

    deleteProductsToCart = async (idCart) => {
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error("ID de Carrito Inexistente");
            }
            cart.products.splice(0, cart.products.length);

            await cartsModel.updateOne({_id: idCart}, cart);
            return this.getAll();
        } catch (error) {
            console.log("estoy en el catch:  " + error.message)
            throw error;
        }

    }

    buyProductToCard = async (idCart, email) => {
        console.log("llego el mail: " + email)
        try {
            const cart = await cartsModel.findOne({ _id: idCart });
            if(cart == undefined){
                throw new Error(`ID de Carrito Inexistente`);
            }
            
            let amount = 0;
            let tiempoTranscurrido = Date.now();
            let ticket = {
                "code": this.generarIdUnico(),
                "amount": amount,
                "purchase_datetime": tiempoTranscurrido,
                "purchase": email
            }
            cart.products.forEach(async product => {
                const productInDB = await productsModel.findOne({ _id: product.productId._id });
                //const productInDB = await productsManager.getByID(product.productId._id);
                if(productInDB == undefined){
                    throw new Error(`ID de Producto Inexistente`);
                }

                if(productInDB.stock >=  product.quantity){
                    productInDB.stock = productInDB.stock - product.quantity;
                    let filter = { _id: product.productId._id };
                    ticket.amount = ticket.amount + (productInDB.price*product.quantity);
                    let position = cart.products.findIndex((element) => element.productId._id == product.productId._id);
                    
                    if(position != -1){
                        cart.products.splice(position, 1);
                    }
                    await productsModel.updateOne({_id: product.productId._id}, productInDB);
                    
                }
                await cartsModel.updateOne({_id: idCart}, cart);
            });
            tiempoTranscurrido = Date.now();
            ticket.purchase_datetime = tiempoTranscurrido//hacer el ticket  
             console.log("amount antes del ticket: " + amount)      
            ticket = {
                "code": this.generarIdUnico(),
                "amount": amount,
                "purchase_datetime": tiempoTranscurrido,
                "purchase": email
            }
            console.log("amount ticket: " + ticket.amount)
            await ticketModel.create(ticket);
            mailManager.sendMailCompra(email, ticket);
            return {"cart": await cartsModel.findOne({ _id: idCart }),
                    "ticket": ticket
                    };
        } catch (error) {
            throw error;
        }

    }

    generarIdUnico = () => { 
        return Math.random().toString(30).substring(2);           
    } 

}