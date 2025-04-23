const express = require('express');
const { createProject
 } = require("../controllers/projects.js")
const {validatorRegisterProject} = require("../validators/projects.js")


const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientId,findClientsUserId } = require("../middleware/findClient.js")
const { findProjectProjectCode } = require("../middleware/findProject.js")

const routerProject = express.Router();

routerProject.use(express.json())
routerProject.post('/',validatorRegisterProject,authMiddleware,checkRol("admin"),findProjectProjectCode,findClientsUserId,createProject)
/*routerProyect.put('/:id',updateClientValidator,authMiddleware,checkRol("admin"),findClientId,updateClient)
routerProyect.get('/',authMiddleware,checkRol("admin"),findClientsUserId,getClients)
routerProyect.get('/:id',authMiddleware,checkRol("admin"),findClientId,getClient)
routerProyect.delete('/:id',authMiddleware,checkRol("admin"),findClientId, deleteClient);
routerProyect.patch('/:id',authMiddleware,checkRol("admin"), restoreClient);*/

module.exports = routerProject;