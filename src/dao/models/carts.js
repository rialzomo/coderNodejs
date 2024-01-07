import mongoose from 'mongoose';

const cartsCollection = 'Carts';

const cartsSchema = mongoose.Schema({
    /*products: {
        type: Array,
        default: []
    }*/
    products: {
        type: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products'
                },
                quantity: Number,
            },
        ],
        default: [],
    },
})

cartsSchema.pre('findOne', function(){
    this.populate('products.productId');
})

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);