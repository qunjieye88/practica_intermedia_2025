const express = require('express');
const { createProject,updateProyect,getProjects,
    getProject,deleteProject,restoreProject
 } = require("../controllers/projects.js")
const {validatorRegisterProject,validatorUpdateProject} = require("../validators/projects.js")


const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientId,findClientsUserId,findClientIdUserId,ClientUserStatus } = require("../middleware/findClient.js")
const { findProjectProjectCode,findProyectIdParams,findProjectsId,ProjectUserStatus} = require("../middleware/findProject.js")

const routerProject = express.Router();

routerProject.use(express.json())
routerProject.post('/',validatorRegisterProject,authMiddleware,checkRol("admin"),findProjectProjectCode,findClientIdUserId,createProject)
routerProject.put('/:id',validatorUpdateProject,authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true),updateProyect)
routerProject.get('/',authMiddleware,checkRol("admin"),findClientsUserId,findProjectsId,getProjects)
routerProject.get('/:id',authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true),getProject)
routerProject.delete('/:id',authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true), deleteProject);
routerProject.patch('/:id',authMiddleware,checkRol("admin"), restoreProject);

module.exports = routerProject;