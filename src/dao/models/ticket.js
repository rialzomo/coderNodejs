import mongoose from "mongoose";

const collection = 'tickest';

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    purchase: {
        type: String,
        required: true
    }
});

export const ticketModel = mongoose.model(collection, schema)