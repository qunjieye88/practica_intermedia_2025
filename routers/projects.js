const express = require('express');
const { createProject,updateProyect,getProjects,
    getProject,deleteProject,restoreProject
 } = require("../controllers/projects.js")
const {validatorRegisterProject,validatorUpdateProject} = require("../validators/projects.js")


const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientId,findClientsUserId } = require("../middleware/findClient.js")
const { findProjectProjectCode,findProyectIdParams,findProjectsId } = require("../middleware/findProject.js")

const routerProject = express.Router();

routerProject.use(express.json())
routerProject.post('/',validatorRegisterProject,authMiddleware,checkRol("admin"),findProjectProjectCode,findClientsUserId,createProject)
routerProject.put('/:id',validatorUpdateProject,authMiddleware,checkRol("admin"),findProyectIdParams,updateProyect)
routerProject.get('/',authMiddleware,checkRol("admin"),findClientsUserId,findProjectsId,getProjects)
routerProject.get('/:id',authMiddleware,checkRol("admin"),findProyectIdParams,getProject)
routerProject.delete('/:id',authMiddleware,checkRol("admin"),findProyectIdParams, deleteProject);
routerProject.patch('/:id',authMiddleware,checkRol("admin"), restoreProject);

module.exports = routerProject;