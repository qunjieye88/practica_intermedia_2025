
const { verifyToken } = require("../utils/handleJwt")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findClientCif = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const cif = data.cif;
        const clientes = await ClientModel.find({cif});
        if (clientes) {
            req.clientes = clientes;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientId = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user._id
        const client = await ClientModel.findOne({_id:id,userId: userId});
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        req.client = client
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientsUserId= async (req, res, next) => {
    try {
        const id = req.user._id
        const clients = await ClientModel.find({userId:id});
        if (!clients) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        req.clients = clients
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { findClientCif, findClientId,findClientsUserId}