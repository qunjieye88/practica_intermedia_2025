const UserModel = require("../models/user.js");
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const { tokenSign, verifyToken } = require("../utils/handleJwt.js")

const registerCtrl = async (req, res) => {
    req = matchedData(req);

    const existingUser = await UserModel.findOne({ email: req.email });
    if (existingUser) {
        return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const emailCode = Math.floor(100000 + Math.random() * 900000);
    const password = await encrypt(req.password);
    const body = { ...req, password, emailCode };
    const newUser = await UserModel.create(body);
    const data = {
        token: await tokenSign(newUser),
        user: {
            _id: newUser._id,
            email: newUser.email,
            status: newUser.status,
            role: newUser.role
        }
    };

    console.log("Código de verificación:", emailCode);
    res.status(201).send(data);
}

const validatorUser = async (req, res) => {

    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    const token = authorization.replace('Bearer ', '');
    try {
        const data = verifyToken(token)
        const user = await UserModel.findOne(
            { _id: data._id },
        )
        if (!user) {
            return res.status(404).json({ message: "Token incorrecto o usuario no encontrado" });
        }
        user.status = 1
        const updatedUser = await UserModel.findByIdAndUpdate(user.id, user, { new: true });
        return res.status(200).json({
            acknowledged: true,
            user: updatedUser
        });

    } catch (data) {
        return res.status(404).json({ message: "Token Incorrecto o Usuario Incorrecto" });
    }
}

const loginUser = async (req, res) => {
    req = matchedData(req);
    const existingUser = await UserModel.findOne({ email: req.email });

    if (!existingUser) {

        return res.status(404).json({ message: "Datos Incorrectos" });

    }

    const verification = await compare(req.password, existingUser.password)
    if (verification && existingUser.status == 1) {
        const password = await encrypt(req.password);
        const body = { ...req, password, emailCode };
        const newUser = await UserModel.create(body);
        const data = {
            token: await tokenSign(newUser),
            user: {
                _id: newUser._id,
                email: newUser.email,
                status: newUser.status,
                role: newUser.role
            }
        };

        console.log("Código de verificación:", emailCode);
        res.status(201).send(data);
    }
    return res.status(404).json({ message: "ERROR" });

}

module.exports = { registerCtrl, validatorUser, loginUser }