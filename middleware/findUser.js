
const { verifyToken } = require("../utils/handleJwt")
const usersModel = require("../models/user")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findUserEmail = async (req, res, next) => {
    const data = matchedData(req);
    try {
        const email = data.email;
        const user = await usersModel.findOne({ email });
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar usuario por email' });
    }
};

const findUserId = async (req, res, next) => {
    const data = matchedData(req);
    try {
        const id = data.userId;
        const user = await usersModel.findById(id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al buscar usuario por email' });
    }
};


module.exports = { findUserEmail,findUserId}