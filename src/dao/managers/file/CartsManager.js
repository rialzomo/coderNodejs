import fs from 'fs'

export class CartsManager{
    constructor(path){
        this.path= path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(path,  JSON.stringify([]));
        }       
    }
    createCarts(){
        let carts = null;
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            carts = JSON.parse(data);
        } catch (error) {
            throw new Error(`Error en la lectura del archivo`);
        }
        if(carts.length === 0){
            let cart = new Cart (1);
            carts.push(cart);                
        }else{
            let id;
            if(carts != null){
                carts.forEach(element => {
                    id = element["idCart"];
                });
            }
            let cart = new Cart (id+1);
            carts.push(cart);
        }
        
        fs.writeFileSync(this.path,  JSON.stringify(carts), {flag: "w"});
    }

    getCartById(id){
        let carts = null;
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            carts = JSON.parse(data);
        } catch (error) {
            throw new Error(`Error en la lectura del archivo`);
        }
        let cart = null;
        
        if(carts != null){
            cart = carts.find((element) => element.idCart == id)
        }
        if(cart !=null && cart != undefined){
            return cart.products;
        }else{
            return [];
        }
    }

    addProductTheCart(idCart, idproduct){
        if(!(this.validar(idproduct)&& this.validar(idCart))){
            throw new Error(`Ningun Elemento puede ser Vacio`);
        }else{
            let carts = null
            try {
                let data = fs.readFileSync(this.path, 'utf-8');
                carts = JSON.parse(data);
            } catch (error) {
                throw new Error(`Error en la lectura del archivo`);
            }

            if(carts != null){
                let cart = null;
                cart = carts.find((element) => element.idCart == idCart)
                let product = null;
                if(cart !=null && cart != undefined){
                    let position;

                    product = cart.products.find((element) => element.idProduct == idproduct)
                    if(product !=null && product != undefined){
                        product.quantity = product.quantity+1;
                    }else{
                        //se podria validar que el producto exista pero la consigna no lo menciona
                        let product = new Product (Number(idproduct),1);
                        cart.products.push(product);
                    }
                    position = carts.findIndex((element) => element.idCart == idCart);    
                    carts[position]=cart;
                    fs.writeFileSync(this.path,  JSON.stringify(carts), {flag: "w"});
                }else{
                    throw new Error(`Id de carrito no existe`);
                }
            }else{
                throw new Error(`Sin carrito`);
            }

        }
        
    }

    validar(cadena){
        return Boolean(cadena);
    }
}

class Cart{
    constructor(idCart){
        this.idCart = idCart;
        this.products = [];
    }
}

class Product{
    constructor(idProduct, quantity){
        this.idProduct = idProduct;
        this.quantity = quantity;
    }
}
export default{CartsManager} ;