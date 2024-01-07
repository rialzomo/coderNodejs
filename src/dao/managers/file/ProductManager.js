import fs from 'fs'

export class ProductManager{
    constructor(path){
        this.path= path;
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(path,  JSON.stringify([]));
        }
    }

    getProducts(){
            try {
                const data = fs.readFileSync(this.path, 'utf-8');
                const json = JSON.parse(data);
                return json;
            } catch (error) {
                return [];
            }
    }
    
    getProductById(id){
        let json = null;
        let products = null;
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            products = JSON.parse(data);
        } catch (error) {
            throw new Error(`Error en la lectura del archivo`);
        }

        let product = null;
        if(products != null){
            product = products.find((element) => element.id == id)
        }
        if(product ==null || product == undefined)
            return "Producto No encontrado"
        else
            return product;
    }

    deleteProductId(id){
        let json = null;
        let products = null;
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            products = JSON.parse(data);
        } catch (error) {
            throw new Error(`Error en la lectura del archivo`);
        }

        let position = null;
        if(products != null){
                position = products.findIndex((element) => element.id == id);
            
        }
        if(position != -1){
            products.splice(position, 1);
            fs.writeFileSync(this.path,  JSON.stringify(products), {flag: "w"});
            return products;
        }else{
            throw new Error(`ID de Producto Inexistente`);
        }
        
        
    }

    updateProductId(id, productChange){
        let json = null;
        let products = null;
        try {
            let data = fs.readFileSync(this.path, 'utf-8');
            products = JSON.parse(data);
        } catch (error) {
            throw new Error(`Error en la lectura del archivo`);
        }
        let position = null;
        if(products != null){
            position = products.findIndex((element) => element.id == id)
        }
        if(position != -1){
            productChange.id=Number(id);
            products[position]=productChange;
            fs.writeFileSync(this.path,  JSON.stringify(products), {flag: "w"});
            return products;
        }else{
            throw new Error(`ID de Producto Inexistente`);
        }
                
    }

    addProduct(title, description,code,price,status,stock,category,thumbnail){
        if(!(this.validar(title) && this.validar(description) && 
            this.validar(thumbnail)&& this.validar(code) && 
            this.validar(price) && this.validar(stock)&& 
            this.validar(category))){
                throw new Error(`Ningun Elemento puede ser Vacio`);
        }else{
            let products = null;
            try {
                let data = fs.readFileSync(this.path, 'utf-8');
                products = JSON.parse(data);
            } catch (error) {
                throw new Error(`Error en la lectura del archivo`);
            }
            
            if(products.length === 0){
                let product = new Product (title, description,code,price,status,stock,category,thumbnail, 1);
                products.push(product)                
            }else{
                let addElement = true;
                let id;
                products.forEach(element => {
                    id = element["id"];
                    if(element["code"] == code){
                        addElement = false
                    }
                });
                if(addElement){
                    let product = new Product (title, description,code,price,status,stock,category,thumbnail, id+1);
                    products.push(product);
                    
                    fs.unlinkSync(this.path);
                    fs.writeFileSync(this.path,  JSON.stringify(products));
                    //console.log(`Producto ${title} agregado: `, product);
                }else{
                    throw new Error(`No se puede agregar el producto, el code: ${code}  ya existe`);
                }
            }
            fs.writeFileSync(this.path,  JSON.stringify(products), {flag: "w"});
            //console.log(`Producto ${title} agregado: `, this.products);
            return products;
        }
        
    }

    validar(cadena){
        return Boolean(cadena);
    }
}

class Product{
    constructor(title, description,code,price,status=true,stock,category,thumbnail,id){
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.category = category;
        this.thumbnail = thumbnail;
        this.stock = stock;
        this.id = id;
    }
}
export default{ProductManager} ;