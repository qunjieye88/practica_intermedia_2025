
const { verifyToken } = require("../utils/handleJwt")
const usersModel = require("../models/user")
const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).send({error: "NO TOKEN"})
            return
        }
        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop()
        //Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
        const dataToken = await verifyToken(token)
        if (!dataToken._id) {
            res.status(401).send({error: "NO_ID_TOKEN"})
            return
        }
        const user = await usersModel.findById(dataToken._id)
        req.user = user // Inyecto al user en la petición
        next()
    } catch (err) {
        res.status(403).send({error: "Error de autenticacion"})
    }
}
module.exports = {authMiddleware}