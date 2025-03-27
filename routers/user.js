const express = require('express');
const { registerCtrl, validatorUser, loginUser,
    updateUser, patchCompany,
    patchLogo, getUser, deleteUser,
    getCodePassword, getPassword,createInvitation } = require("../controllers/user.js")
const {
    validatorRegister, validatorValidator, validatorLogin,
    validatorUpdate, validatorCompany, validatorCodePassword,
    validatorPassword, validatorInviteUser
} = require("../validators/user.js")
const { uploadMiddlewareMemory } = require("../utils/handleStorage.js")

const routerUser = express.Router();

routerUser.use(express.json())

routerUser.post('/register', validatorRegister, registerCtrl)
routerUser.put('/validation', validatorValidator, validatorUser)
routerUser.post('/login', validatorLogin, loginUser)
routerUser.put('/register', validatorUpdate, updateUser)
routerUser.patch('/company', validatorCompany, patchCompany)
routerUser.patch('/logo', uploadMiddlewareMemory.single("image"), patchLogo)
routerUser.get('/', getUser)
routerUser.delete('/', deleteUser)
routerUser.get('/codePassword', validatorCodePassword, getCodePassword)
routerUser.patch('/password', validatorPassword, getPassword)
routerUser.post('/invite', validatorInviteUser, createInvitation)
//patch es actualizar
//put es remplazar


module.exports = routerUser;