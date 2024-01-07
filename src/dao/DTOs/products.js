export default class ProductDTO {
    constructor(product) {
        this.name = product.name,
            this.price = product.price > 0 ? product.price : 0,
            this.active = true;
    }
}