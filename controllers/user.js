const UserModel = require("../models/user.js");
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");

const registerCtrl = async (req, res) => {
    req = matchedData(req);
    const existingUser = await UserModel.findOne({ email: req.email });
    if (existingUser) {
        res.status(409).json({ message: "El correo ya está registrado" });
    } else {
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
}

const validatorUser = async (req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')
    req = matchedData(req);
    if (!token) {
        res.status(400).json({ message: 'Authentication token is missing' });
    } else {
        try {
            const data = verifyToken(token)
            const user = await UserModel.findById(data._id)
            if (user && user.emailCode == req.code) {
                const updatedUser = await UserModel.findByIdAndUpdate(data._id, { status: 1 }, { new: true });
                if (!updatedUser) {
                    res.status(400).json({ message: "Token incorrecto o usuario no encontrado" });
                } else {
                    res.status(200).json({ message: updatedUser });

                }

            } else {
                res.status(400).json({ message: "Usuario No Existe/Codigo incorrecto" });
            }

        } catch (data) {
            res.status(400).json({ message: "Token Incorrecto" });
        }

    }

}

const loginUser = async (req, res) => {
    req = matchedData(req);
    const existingUser = await UserModel.findOne({ email: req.email });

    if (!existingUser) {
        res.status(404).json({ message: "User not found" });
    } else {
        if (existingUser.status == 0) {
            res.status(400).json({ message: "User is not validated." });
        } else {
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
                res.status(201).send(data);
            } else {
                res.status(400).json({ message: "Incorrect password" });
            }
        }
    }
}



const updateUser = async (req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')

    req = matchedData(req);
    if (!token) {
        res.status(400).json({ message: 'Authentication token is missing' });
    } else {
        try {

            const data = verifyToken(token)
            const updatedUser = await UserModel.findByIdAndUpdate(data._id, req, { new: true });
            if (!updatedUser) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            } else {
                res.status(200).json(updatedUser);
            }
        } catch (data) {
            res.status(400).json({ message: "Token Incorrecto o Datos Incorrectos" });
        }


    }
}


const patchCompany = async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '')
    req = matchedData(req);
    if (!token) {
        res.status(401).json({ message: 'Authentication token is missing' });
    } else {
        try {
            const data = verifyToken(token)
            if (!req.company.name || !req.company.cif) {
                const user = await UserModel.findById(data._id);
                if (user.name && user.nif) {
                    req.company = { ...req.company, name: user.name, cif: user.nif }
                    const updatedUser = await UserModel.findByIdAndUpdate(data._id, req, { new: true });

                    if (!updatedUser) {
                        res.status(404).json({ message: 'Usuario no encontrado' });
                    } else {
                        res.status(200).json(updatedUser);
                    }
                } else {

                    res.status(400).json({ message: 'Usuario sin nombre/cif' });
                }
            } else {

                const updatedUser = await UserModel.findOneAndReplace({ _id: data._id }, req, { new: true });
                console.log(updatedUser)
                if (!updatedUser) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.status(200).json(updatedUser);
                }
            }
        } catch (data) {
            res.status(401).json({ message: "Token Incorrecto o Datos Incorrectos" });
        }
    }
}


const patchLogo = async (req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')
    try {
        const user = verifyToken(token)
        const id = user._id
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        const data = await UserModel.findOneAndUpdate({ _id: id }, { url: ipfs, filename: fileName }, { new: true })
        if (data) {
            res.send(data)
        } else {
            res.status(404).send("Usuario no existe")
        }
    } catch (err) {
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
        //handleHttpError(res, "ERROR_UPLOAD_COMPANY_IMAGE")
    }
}


const getUser = async (req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')
    if (!token) {
        res.status(401).json({ message: 'Authentication token is missing' });
    } else {
        try {
            const data = verifyToken(token)
            const user = await UserModel.findById(data._id);
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            } else {
                res.status(200).json(user);
            }
        } catch (data) {
            res.status(400).json({ message: "Token Incorrecto o Datos Incorrectos" });
        }
    }
}

const deleteUser = async (req, res) => {

    const token = req.headers.authorization.replace('Bearer ', '')
    if (!token) {
        res.status(400).json({ message: 'Authentication token is missing' });
    } else {
        try {
            const data = verifyToken(token)
            if (req.query.soft == "true") {
                const user = await UserModel.delete({ _id: data._id });
                if (!user) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.status(200).json({ user, message: 'Usuario eliminado (soft delete)' });
                }
            } else {
                const user = await UserModel.findByIdAndDelete(data._id);
                if (!user) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.status(200).json({ user, message: 'Usuario eliminado permanentemente (hard delete)' });
                }

            }
        } catch (data) {
            res.status(400).json({ message: "Token Incorrecto o Datos Incorrectos" });
        }
    }
}

const getCodePassword = async (req, res) => {

    req = matchedData(req);
    const user = await UserModel.findOne({ email: req.email });
    if (!user) {
        res.status(409).json({ message: "El correo no esta registrado" });
    } else {
        const data = {
            email: req.email
        };
        console.log("Código de verificación:", user.emailCode);
        res.status(201).send(data);
    }

}

const getPassword = async (req, res) => {

    req = matchedData(req);
    const user = await UserModel.findOne({ email: req.email });
    if (!user) {
        res.status(409).json({ message: "El correo no esta registrado" });
    } else {
        if (req.code == user.emailCode) {
            const password = await encrypt(req.password);
            const updatedUser = await UserModel.findByIdAndUpdate(user._id, { password: password }, { new: true });
            res.status(200).send({ password: user.password });
        } else {
            res.status(400).json({ message: "Codigo incorrecto" });
        }
    }

}
const createInvitation = async (req, res) => {
    req = matchedData(req);
    const existingUser = await UserModel.findOne({ email: req.email });
    if (existingUser) {
        res.status(409).json({ message: "El correo ya está registrado" });
    } else {
        const userCompany = await UserModel.findOne({ "company.name": req.company.name });
        if (userCompany) {
            const password = await encrypt(req.password);
            const emailCode = Math.floor(100000 + Math.random() * 900000);
            const body = { ...req, password, emailCode,role:"guest" };
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

        } else {

            res.status(404).send({ menssage: "Compania no existe" });
        }


    }
}

module.exports = {
    registerCtrl, validatorUser, loginUser,
    updateUser, patchLogo,
    getUser, deleteUser, getCodePassword,
    getPassword, patchCompany, createInvitation
}