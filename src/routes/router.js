import { Router } from 'express'
import jwt from 'jsonwebtoken'

export default class RouterCustom {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {

    }

    getCustom(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    postCustom(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomPOSTResponses, this.applyCallbacks(callbacks));
    }

    putCustom(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    deleteCustom(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback(...params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error);
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccessCustom = (payload) => res.send({ status: "success", payload });
        res.sendServerError = (error) => res.status(500).send({ status: "error" }, error);
        res.sendClientError = (error) => res.status(400).send({ status: "error" }, error);
        next();
    }

    generateCustomPOSTResponses = (req, res, next) => {
        res.sendSuccessCustom = (payload) => res.send({ status: "success 200", payload });
        res.sendServerError = (error) => res.status(500).send({ status: "error" }, error);
        res.sendClientError = (error) => res.status(400).send({ status: "error" }, error);
        next();
    }

    handlePolicies = (policies) => (req, res, next) => {
        console.log("llegue a las politicas");
        console.log("politica: " + policies);
        if (policies[0] === "PUBLIC") return next();
        const authHeaders = req.headers.authorization;;
        console.log("authHeaders: " + authHeaders);
        if (!authHeaders) {
            return res.status(401).send({ status: "error", error: 'Unauthorized'})
        }
        const token = authHeaders.split(" ")[1];
        let user = jwt.verify(token, 'coderSecret');
        console.log("user: " + user)
        console.log("rol: " + user.rol);
        if (!policies.includes(user.rol.toUpperCase())) {
            return res.status(403).send({ status: "error", error: "No posee permisos" })
        }
        req.user = user;
        next();
    }
}