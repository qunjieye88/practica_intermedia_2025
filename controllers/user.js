const UserModel = require("../models/user.js");
const { matchedData } = require("express-validator")
const { encrypt, compare ,hola} = require("../utils/handlePassword")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");

const registerCtrl = async (req, res) => {//hecho
    try {
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
    } catch (error) {
        res.status(404).send({ message: "Error Registro" });

    }

}

const validatorUser = async (req, res) => {
    try {
        const user = req.user
        req = matchedData(req);

        if (user && user.emailCode == req.code) {
            user.status = 1
            const updatedUser = await user.save()
            //const updatedUser = await UserModel.findByIdAndUpdate(user._id, { status: 1 }, { new: true });
            if (!updatedUser) {
                res.status(400).json({ message: "Error al guardar datos" });
            } else {
                res.status(200).json({ message: updatedUser });
            }

        } else {
            res.status(400).json({ message: "Usuario No Existe/Codigo incorrecto" });
        }
    } catch (error) {
        res.status(404).send({ message: "Error Validacion" });

    }
}

const loginUser = async (req, res) => {
    try {
        const user = req.user
        const data = {
            token: await tokenSign({ _id: user._id, role: user.role }),
            user: {
                email: user.email,
                role: user.role,
                _id: user._id,
                name: user.name
            }
        };
        res.status(201).send(data);
    } catch (error) {
        res.status(404).send({ message: "Error login" });
    }
}



const updateUser = async (req, res) => {
    try {
        const user = req.user
        req = matchedData(req);
        user.set(req);
        const updatedUser = await user.save();
        if (!updatedUser) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        res.status(404).send({ message: "Error Update" });
    }
}


const patchCompany = async (req, res) => {
    try {
        const user = req.user
        req = matchedData(req);
        if (!req.company.name || !req.company.cif) {
            if (user.name && user.nif) {
                req.company = { ...req.company, name: user.name, cif: user.nif }
            } else {
                res.status(400).json({ message: 'Usuario sin nombre/cif' });
            }
        }
        user.set(req);
        const updatedUser = await user.save();
        if (!updatedUser) {
            res.status(404).json({ message: 'Usuario no actualizado' });
        } else {
            res.status(200).json(updatedUser);
        }
    } catch (error) {
        res.status(404).send({ message: "Error actualizar compania" });
    }

}


const patchLogo = async (req, res) => {
    try {
        const user = req.user
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname
        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash
        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`
        user.set({ url: ipfs, filename: fileName });
        const updatedUser = await user.save();
        if (updatedUser) {
            res.send(updatedUser)
        } else {
            res.status(404).send("Usuario no existe")
        }
    } catch (err) {
        res.status(500).send("ERROR_UPLOAD_COMPANY_IMAGE")
    }
}


const getUser = async (req, res) => {
    try {
        const user = req.user
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario Eliminado o inexiet' });
        }
    } catch (error) {
        res.status(404).send({ message: "Error Usuario" });
    }
}
const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (req.query.soft === "true") {
            await user.delete();
            res.status(200).json({ user, message: 'Usuario eliminado (soft delete)' });
        } else {
            const deletedUser = await UserModel.findByIdAndDelete(user._id); // Hard delete
            if (!deletedUser) {
                res.status(404).json({ message: 'Usuario no encontrado' });
            } else {
                res.status(200).json({ user: deletedUser, message: 'Usuario eliminado permanentemente (hard delete)' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};

const getCodePassword = async (req, res) => {
    try {
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
    } catch (err) {
        res.status(500).json({ message: 'Error Codigo' });
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
            const body = { ...req, password, emailCode, role: "guest" };
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

const getUsers = async (req, res) => {
    const existingUser = await UserModel.find({});
    //const existingUser = await UserModel.deleteMany({})
    res.status(200).send(existingUser);
}
const deleteAllUsers = async (req, res) => {
    const existingUser = await UserModel.deleteMany({})
    res.status(200).send(existingUser);
}
module.exports = {
    registerCtrl, validatorUser, loginUser,
    updateUser, patchLogo,
    getUser, deleteUser, getCodePassword,
    getPassword, patchCompany, createInvitation,
    getUsers,deleteAllUsers
}