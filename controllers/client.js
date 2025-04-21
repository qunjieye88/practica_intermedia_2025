const { matchedData } = require("express-validator");
const ClientModel = require("../models/client.js");
const mongoose = require('mongoose');
const createClient = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        const clientes = req.clientes
        req = matchedData(req)
        if (clientes) {
            const clienteExistente = clientes.some(cliente => cliente.userId.toString() === userId.toString());

            if (clienteExistente) {
                return res.status(404).send({ message: "Ya Existe Cliente" });
            }
        }
        const newUser = await ClientModel.create({
            ...req,
            userId: new mongoose.Types.ObjectId(userId)
        });
        res.status(201).send(newUser);

    } catch (error) {
        res.status(404).send({ message: "Error Crear" });

    }
}


module.exports = {
    createClient
}
