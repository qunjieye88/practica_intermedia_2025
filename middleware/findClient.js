
const { verifyToken } = require("../utils/handleJwt")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")


const ClientUserStatus = (status) =>  async (req, res, next) => {
    try {
        const userId = req.user._id;
        const client = req.client

        if(client){
            if(userId.equals(client.userId) === status){
                next()
            }else if(status === false){
                res.status(400).json({ message: "El Cliente Pertenece Al Usuario" });
            }else{
                res.status(400).json({ message: "El Cliente No Pertenece Al Usuario" });
            }
        }else{
            if(status === false){
                next()
            }else{
                res.status(400).json({ message: "El Cliente No Existe" });
            }
        }
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
        const client = await ClientModel.findById(clientId);
        req.client = client
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const findClientIdUserId = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const data = matchedData(req)
        const clientId = data.clientId;
        const client = await ClientModel.findOne({userId: userId,_id:clientId });
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

module.exports = { findClientCif,ClientUserStatus, findClientId,findClientIdUserId, findClientCifUserId, findClientIdParams, findClientsUserId }