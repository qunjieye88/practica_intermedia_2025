const express = require('express');
const { createClient,updateClient,getClients,
    getClient,deleteClient,restoreClient
 } = require("../controllers/client.js")
const {createValidator, updateClientValidator} = require("../validators/client.js")


const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientId,findClientsUserId } = require("../middleware/findClient.js")

const routerClient = express.Router();

routerClient.use(express.json())


routerClient.post('/',createValidator,authMiddleware,checkRol("admin"),findClientCif,createClient)
routerClient.put('/:id',updateClientValidator,authMiddleware,checkRol("admin"),findClientId,updateClient)
routerClient.get('/',authMiddleware,checkRol("admin"),findClientsUserId,getClients)
routerClient.get('/:id',authMiddleware,checkRol("admin"),findClientId,getClient)
routerClient.delete('/:id',authMiddleware,checkRol("admin"),findClientId, deleteClient);
routerClient.patch('/:id',authMiddleware,checkRol("admin"), restoreClient);

module.exports = routerClient;