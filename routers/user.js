const express = require('express');
const {registerCtrl,validatorUser,loginUser,updateUser} = require("../controllers/user.js")
const { validatorRegister,validatorValidator,validatorLogin,validatorUpdate} = require("../validators/user.js")

const routerUser = express.Router();

routerUser.use(express.json())

routerUser.post('/register',validatorRegister, registerCtrl)
routerUser.put('/validation',validatorValidator, validatorUser)
routerUser.post('/login',validatorLogin, loginUser)
routerUser.put('/register',validatorUpdate, updateUser)


module.exports = routerUser;