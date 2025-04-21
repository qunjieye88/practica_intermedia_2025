
const { verifyToken } = require("../utils/handleJwt")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findClientCif = async (req, res, next) => {
    const data = matchedData(req);
    const cif = data.cif;
    const clientes = await ClientModel.find({cif});
    if (clientes) {
        req.clientes = clientes;
    }
    next();
};

module.exports = { findClientCif }