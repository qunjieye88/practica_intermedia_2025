const UserModel = require("../models/user.js");
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const { tokenSign, verifyToken } = require("../utils/handleJwt.js")

const registerCtrl = async (req, res) => {
    req = matchedData(req);

    const existingUser = await UserModel.findOne({ email: req.email });
    if (existingUser) {
        return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const password = await encrypt(req.password);
    const emailCode = Math.floor(100000 + Math.random() * 900000);
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

    const token = req.headers.authorization.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    try {
        const data = verifyToken(token)
        const updatedUser = await UserModel.findByIdAndUpdate(data._id, {status:1}, { new: true });

        if (!updatedUser) {
            return res.status(401).json({ message: "Token incorrecto o usuario no encontrado" });
        }
        return res.status(200).json({ message: updatedUser });

    } catch (data) {
        return res.status(401).json({ message: "Token Incorrecto o Usuario Incorrecto" });
    }
}

const loginUser = async (req, res) => {
    req = matchedData(req);
    const existingUser = await UserModel.findOne({ email: req.email });

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.status == 0) {
        return res.status(401).json({ message: "User is not validated." });
    }

    const verification = await compare(req.password, existingUser.password)

    if (verification) {
        const data = {
            token: await tokenSign({ _id: existingUser._id, role: existingUser.role }),
            user: {
                email: existingUser.email,
                role: existingUser.role,
                _id: existingUser._id,
                name: existingUser.name
            }
        };

        return res.status(201).send(data);
    }
    return res.status(404).json({ message: "User not found" });
}



const updateUser = async (req, res) => {


    const token = req.headers.authorization.replace('Bearer ', '')
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }
    try {
        const data = verifyToken(token)
        const updatedUser = await UserModel.findByIdAndUpdate(data._id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(updatedUser);

    } catch (data) {
        return res.status(401).json({ message: "Token Incorrecto o Usuario Incorrecto" });
    }

}


module.exports = { registerCtrl, validatorUser, loginUser, updateUser }