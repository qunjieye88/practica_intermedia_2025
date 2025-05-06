const express = require('express');
const { createProject,updateProyect,getProjects,
    getProject,deleteProject,restoreProject
 } = require("../controllers/projects.js")
const {validatorRegisterProject,validatorUpdateProject} = require("../validators/projects.js")
const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientId,ClientUserStatus } = require("../middleware/findClient.js")
const { findProyectIdParams,findProjectsId,ProjectUserStatus} = require("../middleware/findProject.js")
const routerProject = express.Router();
routerProject.use(express.json())


/**
 * @swagger
 * tags:
 *     name: Project
 *     description: Endpoints para manejar proyectos
 */

/**
 * @swagger
 *   /api/project:
 *     post:
 *       tags: [Project]
 *       summary: Crea un nuevo proyecto
 *       security:
 *         - BearerAuth: []
 *       description: Crea un nuevo proyecto para un cliente
 *       operationId: createProject
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       responses:
 *         201:
 *           description: Proyecto creado con éxito
 *         400:
 *           description: Error en la solicitud
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.post('/',validatorRegisterProject,authMiddleware,checkRol("admin"),findClientId,ClientUserStatus(true),createProject)
/**
 * @swagger
 *   /api/project/{id}:
 *     put:
 *       tags: [Project]
 *       summary: Actualiza un proyecto existente
 *       security:
 *         - BearerAuth: []
 *       description: Actualiza los detalles de un proyecto específico
 *       operationId: updateProject
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID del proyecto a actualizar
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       responses:
 *         200:
 *           description: Proyecto actualizado correctamente
 *         400:
 *           description: Error en la solicitud
 *         404:
 *           description: Proyecto no encontrado
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.put('/:id',validatorUpdateProject,authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true),updateProyect)

/**
 * @swagger
 *   /api/project:
 *     get:
 *       tags: [Project]
 *       summary: Obtiene todos los proyectos
 *       security:
 *         - BearerAuth: []
 *       description: Obtiene una lista de todos los proyectos registrados
 *       operationId: getProjects
 *       responses:
 *         200:
 *           description: Lista de proyectos
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.get('/',authMiddleware,checkRol("admin"),findProjectsId,getProjects)

/**
 * @swagger
 *   /api/project/{id}:
 *     get:
 *       tags: [Project]
 *       summary: Obtiene un proyecto por ID
 *       security:
 *         - BearerAuth: []
 *       description: Obtiene los detalles de un proyecto específico
 *       operationId: getProject
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID del proyecto a obtener
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Proyecto encontrado
 *         404:
 *           description: Proyecto no encontrado
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.get('/:id',authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true),getProject)
/**
 * @swagger
 *   /api/project/{id}:
 *     delete:
 *       tags: [Project]
 *       summary: Elimina un proyecto
 *       security:
 *         - BearerAuth: []
 *       description: Elimina un proyecto de forma permanente o en estado "soft delete"
 *       operationId: deleteProject
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID del proyecto a eliminar
 *           schema:
 *             type: string
 *         - name: soft
 *           in: query
 *           required: false
 *           description: Indica si el borrado es lógico (soft delete)
 *           schema:
 *             type: boolean
 *             default: false
 *       responses:
 *         200:
 *           description: Proyecto eliminado
 *         404:
 *           description: Proyecto no encontrado
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.delete('/:id',authMiddleware,checkRol("admin"),findProyectIdParams,ProjectUserStatus(true), deleteProject);
/**
 * @swagger
 *   /api/project/{id}:
 *     patch:
 *       tags: [Project]
 *       summary: Restaura un proyecto eliminado
 *       security:
 *         - BearerAuth: []
 *       description: Restaura un proyecto que ha sido eliminado anteriormente
 *       operationId: restoreProject
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID del proyecto a restaurar
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Proyecto restaurado
 *         404:
 *           description: Proyecto no encontrado
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
routerProject.patch('/:id',authMiddleware,checkRol("admin"), restoreProject);
/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - projectCode
 *         - email
 *         - address
 *         - clientId
 *       properties:
 *         name:
 *           type: string
 *           example: "Proyecto de Desarrollo"
 *         projectCode:
 *           type: string
 *           example: "PROY-123"
 *         email:
 *           type: string
 *           example: "cliente@empresa.com"
 *         address:
 *           type: object
 *           required:
 *             - street
 *             - number
 *             - postal
 *             - city
 *             - province
 *           properties:
 *             street:
 *               type: string
 *               example: "Calle Falsa"
 *             number:
 *               type: integer
 *               example: 22
 *             postal:
 *               type: integer
 *               example: 28013
 *             city:
 *               type: string
 *               example: "Madrid"
 *             province:
 *               type: string
 *               example: "Madrid"
 *         code:
 *           type: string
 *           example: "CDP-456"
 *         clientId:
 *           type: string
 *           example: "6810c8638e0c578ef8121698"
 *         notes:
 *           type: string
 *           example: "Notas adicionales del proyecto"
 */

module.exports = routerProject;