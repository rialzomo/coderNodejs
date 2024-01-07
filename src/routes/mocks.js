import { Router } from "express";
import { generateProduct } from "../utilsMocks.js";

const router = Router();

router.get('/mockiongproducts', async(req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
    }
    res.send({status: 'success', payload: products});
});

export default router;