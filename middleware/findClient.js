
const { verifyToken } = require("../utils/handleJwt")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")


const ClientUserStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const client = req.client
        console.log(userId)
        console.log(client)
        if(!userId.equals(client.userId)){
            return res.status(400).json({ message: "Cliente No Pertenece a Usuario" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientCif = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const cif = data.cif;
        const client = await ClientModel.findOne({ cif });
        if (client) {
            req.client = client;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientCifUserId = async (req, res, next) => {
    try {
        const userId = req.user._id
        const data = matchedData(req);
        const cif = data.cif;
        const client = await ClientModel.findOne({ cif:cif, userId:userId });
        req.client = client;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientIdParams = async (req, res, next) => {
    try {
        const id = req.params.id;
        const client = await ClientModel.findById(id);
        req.client = client
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientId = async (req, res, next) => {
    try {
        const data = matchedData(req)
        const clientId = data.clientId;
        const userId = req.user._id
        const client = await ClientModel.findOne({ _id: clientId, userId: userId });
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        req.client = client
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findClientsUserId = async (req, res, next) => {
    try {
        const id = req.user._id
        const clients = await ClientModel.find({ userId: id });
        req.clients = clients
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { findClientCif,ClientUserStatus, findClientId, findClientCifUserId, findClientIdParams, findClientsUserId }