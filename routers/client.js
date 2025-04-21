const express = require('express');
const { createClient } = require("../controllers/client.js")
const {createValidator} = require("../validators/client.js")


const { checkRol,checkRolNot } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif } = require("../middleware/findClient.js")

const routerClient = express.Router();

routerClient.use(express.json())

routerClient.post('/',authMiddleware,checkRol("admin"),createValidator,findClientCif,createClient)

module.exports = routerClient;