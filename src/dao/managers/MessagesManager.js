import { messagesModel } from "../models/messages.js";

export default class MessagesManager {
    constructor() {
    }
    getAll = async () => {
        const result = await messagesModel.find();
        console.log ("[MessagesManager - getAll] - result: " + result);
        return result.map(data => data.toObject());
    }

    save = async (message) => {
        try {
            const result = await messagesModel.create(message);
            console.log ("[MessagesManager - saveCart] - result: " + result);
            return result;
        } catch (error) {
            throw error;
        }
    }

}