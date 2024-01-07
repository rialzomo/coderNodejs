import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import config from "../../config.js";

const productsCollection = 'Products';
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    },
    stock:{
        type: Number,
        required: true
    },
    owner:{
        type: String,
        default: config.adminPassword
    }
})
productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productsCollection, productsSchema);