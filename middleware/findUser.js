
const usersModel = require("../models/user")
const { matchedData } = require("express-validator")

const findUserEmail = async (req, res, next) => {
    const data = matchedData(req);
    try {
        const email = data.email;
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "Usuario No Encontrado" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({ error: error });
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
        res.status(500).send({ error: error });
    }
};


module.exports = { findUserEmail, findUserId }