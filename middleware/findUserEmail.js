
const { verifyToken } = require("../utils/handleJwt")
const usersModel = require("../models/user")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findUserEmail = async (req, res, next) => {
    const data = matchedData(req);
    try {
        const email = data.email;
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Correo Incorrecto' });
        } else if (user.status == 0) {
            return res.status(400).json({ message: "User is not validated." });
        } else {
            const verification = await compare(data.password, user.password)
            console.log(verification)
            if (verification) {
                req.user = user;
                next();
            } else {
                return res.status(400).json({ message: "Contraseña incorrecta" });
            }
        }
    } catch (error) {
        console.log(data)
        return res.status(500).json({ message: 'Error al buscar usuario por email' });
    }
};

module.exports = { findUserEmail }