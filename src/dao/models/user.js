import mongoose from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    },
    last_conection:{
        type: Date
    },
    documents: {
        type: Array,
        default: []
    },
    verificacionIdentificacion: {
        type: Boolean,
        default: false
    },
    verificacionDomicilio: {
        type: Boolean,
        default: false
    },
    verificacionCuenta: {
        type: Boolean,
        default: false
    },
    verificacionPerfil: {
        type: Boolean,
        default: false
    },
    carts: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Carts'
                }
            },
        ],
        default: 0,
    },
});

schema.pre('findOne', function(){
    this.populate('carts.cart');
})

export const userModel = mongoose.model(collection, schema)