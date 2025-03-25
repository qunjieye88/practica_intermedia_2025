const express = require('express');
const {registerCtrl,validatorUser,loginUser} = require("../controllers/user.js")
const { validatorRegister,validatorValidator,validatorLogin} = require("../validators/user.js")

const routerUser = express.Router();

routerUser.use(express.json())

routerUser.post('/register',validatorRegister, registerCtrl)
routerUser.put('/validation',validatorValidator, validatorUser)
routerUser.post('/login',validatorLogin, loginUser)

module.exports = routerUser;