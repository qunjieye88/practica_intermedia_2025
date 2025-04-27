const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { isValidObjectId } = require('mongoose');

const ClientUserStatus = (status) =>  async (req, res, next) => {
    try {
        const userId = req.user._id;
        const client = req.client
        if(client){
            if(userId.equals(client.userId) === status){
                next()
            }else if(status === false){
                res.status(400).json({ error: "El Cliente Pertenece Al Usuario" });
            }else{
                res.status(400).json({ error: "El Cliente No Pertenece Al Usuario" });
            }
        }else{
            if(status === false){
                next()
            }else{
                res.status(400).json({ error: "El Cliente No Existe" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findClientCif = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const cif = data.cif;
        const client = await ClientModel.findOne({ cif });
        if (!client) {
            return res.status(404).json({ error: "Cliente No Encontrado" });
        }
        req.client = client;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findClientCifUserId = async (req, res, next) => {
    try {
        const userId = req.user._id
        const data = matchedData(req);
        const cif = data.cif;
        const client = await ClientModel.findOne({ cif:cif, userId:userId });
        if (!client) {
            return res.status(404).json({ error: "Cliente No Encontrado" });
        }
        req.client = client;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findClientIdParams = async (req, res, next) => {
    try {
        const id = req.params.id; 
        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const client = await ClientModel.findById(id);
        if (!client) {
            return res.status(404).json({ error: "Cliente No Encontrado" });
        }
        req.client = client
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findClientId = async (req, res, next) => {
    try {
        const data = matchedData(req)
        const clientId = data.clientId;
        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: "Cliente No Encontrado" });
        }
        req.client = client
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const findClientIdUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const data = matchedData(req)
        const clientId = data.clientId;
        const client = await ClientModel.findOne({userId: userId,_id:clientId });
        if (!client) {
            return res.status(404).json({ error: "Cliente No Encontrado" });
        }
        req.client = client
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findClientsUserId = async (req, res, next) => {
    try {
        const id = req.user._id
        const clients = await ClientModel.find({ userId: id });
        if (!clients) {
            return res.status(404).json({ error: "Clientes No Encontrados" });
        }
        req.clients = clients
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { findClientCif,ClientUserStatus, findClientId,findClientIdUserId, findClientCifUserId, findClientIdParams, findClientsUserId }