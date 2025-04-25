const express = require('express');
const { createClient,updateClient,getClients,
    getClient,deleteClient,restoreClient
 } = require("../controllers/client.js")
const {createValidator, updateClientValidator} = require("../validators/client.js")


const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientIdParams,findClientCifUserId,findClientsUserId ,
    ClientUserStatus} = require("../middleware/findClient.js")

const routerClient = express.Router();

routerClient.use(express.json())


routerClient.post('/',createValidator,authMiddleware,checkRol("admin"),findClientCifUserId,ClientUserStatus(false),createClient)
routerClient.put('/:id',updateClientValidator,authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true),updateClient)
routerClient.get('/',authMiddleware,checkRol("admin"),findClientsUserId,getClients)
routerClient.get('/:id',authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true),getClient)
routerClient.delete('/:id',authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true), deleteClient);
routerClient.patch('/:id',authMiddleware,checkRol("admin"), restoreClient);

module.exports = routerClient;