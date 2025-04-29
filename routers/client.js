const express = require('express');
const { createClient,updateClient,getClients,
    getClient,deleteClient,restoreClient
 } = require("../controllers/client.js")
const {createValidator, updateClientValidator} = require("../validators/client.js")
const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const {findClientIdParams,findClientsUserId ,ClientUserStatus} = require("../middleware/findClient.js")
const routerClient = express.Router();
routerClient.use(express.json())

/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Endpoints para la gestión de clientes
 */
/**
 * @swagger
 * /api/client:
 *   post:
 *     tags: [Cliente]
 *     summary: Crear un nuevo cliente
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso prohibido
 */
routerClient.post('/',createValidator,authMiddleware,checkRol("admin"),createClient)
/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     tags: [Cliente]
 *     summary: Actualizar un cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */

routerClient.put('/:id',updateClientValidator,authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true),updateClient)
/**
 * @swagger
 * /api/client:
 *   get:
 *     tags: [Cliente]
 *     summary: Obtener todos los clientes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
routerClient.get('/',authMiddleware,checkRol("admin"),findClientsUserId,getClients)
/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     tags: [Cliente]
 *     summary: Obtener un cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente no encontrado
 */
routerClient.get('/:id',authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true),getClient)
/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     tags: [Cliente]
 *     summary: Eliminar un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 */

routerClient.delete('/:id',authMiddleware,checkRol("admin"),findClientIdParams,ClientUserStatus(true), deleteClient);
/**
 * @swagger
 * /api/client/{id}:
 *   patch:
 *     tags: [Cliente]
 *     summary: Restaurar un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cliente restaurado
 *       404:
 *         description: Cliente no encontrado
 */

routerClient.patch('/:id',authMiddleware,checkRol("admin"), restoreClient);
/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         address:
 *           type: string
 *           example: Calle Falsa 123
 *         phone:
 *           type: string
 *           example: '600123456'
 *         email:
 *           type: string
 *           example: juan@example.com
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           example: active
 */

module.exports = routerClient;