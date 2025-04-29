const express = require('express');

const { createDeliveryNote, getDeliveryNotes, getDeliveryNote,
    createPDF, createSinged, deleteDeliveryNote
} = require("../controllers/deliveryNote.js")

const { createDeliveryNoteValidator } = require("../validators/deliveryNote.js")
const { uploadMiddlewareMemory } = require("../utils/handleStorage.js")

const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientId, ClientUserStatus } = require("../middleware/findClient.js")
const { findProyectId, projectClientStatus } = require("../middleware/findProject.js")
const { findAllDeliveriNoteUserId,
    findDeliveriNoteIdParam, DeliveryNoteUserStatus } = require("../middleware/findDeliveriNote.js")


const reouterDeliveryNote = express.Router();
/**
 * @swagger
 * tags:
 *     name: DeliveryNote
 *     description: Endpoints para manejar notas de entrega
 */
reouterDeliveryNote.use(express.json())
/**
 * @swagger
 *   /api/deliveryNote:
 *     post:
 *       tags: [DeliveryNote]
 *       summary: Crea una nueva nota de entrega
 *       description: Crea una nueva nota de entrega para un cliente y un proyecto
 *       operationId: createDeliveryNote
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryNote'
 *       responses:
 *         201:
 *           description: Nota de entrega creada con éxito
 *         400:
 *           description: Error en la solicitud
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.post('/', createDeliveryNoteValidator, authMiddleware, checkRol("admin"),
    findClientId, findProyectId, ClientUserStatus(true), projectClientStatus(true), createDeliveryNote)
/**
 * @swagger
 *   /api/deliveryNote:
 *     get:
 *       tags: [DeliveryNote]
 *       summary: Obtiene todas las notas de entrega
 *       description: Obtiene todas las notas de entrega asociadas al usuario
 *       operationId: getDeliveryNotes
 *       responses:
 *         200:
 *           description: Lista de notas de entrega
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.get('/', authMiddleware, checkRol("admin"), findAllDeliveriNoteUserId, getDeliveryNotes);
/**
 * @swagger
 *   /api/deliveryNote/{id}:
 *     get:
 *       tags: [DeliveryNote]
 *       summary: Obtiene una nota de entrega por ID
 *       description: Obtiene los detalles de una nota de entrega específica por ID
 *       operationId: getDeliveryNote
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID de la nota de entrega a obtener
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Nota de entrega encontrada
 *         404:
 *           description: Nota de entrega no encontrada
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.get('/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), getDeliveryNote);
/**
 * @swagger
 *   /api/deliveryNote/pdf/{id}:
 *     get:
 *       tags: [DeliveryNote]
 *       summary: Genera un PDF de la nota de entrega
 *       description: Genera un archivo PDF para una nota de entrega específica
 *       operationId: createPDF
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID de la nota de entrega a generar el PDF
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: PDF generado con éxito
 *         404:
 *           description: Nota de entrega no encontrada
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.get('/pdf/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), createPDF);
/**
 * @swagger
 *   /api/deliveryNote/sign/{id}:
 *     patch:
 *       tags: [DeliveryNote]
 *       summary: Firma una nota de entrega
 *       description: Añade una firma a una nota de entrega específica
 *       operationId: createSinged
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID de la nota de entrega a firmar
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *                   description: Imagen de la firma
 *       responses:
 *         200:
 *           description: Firma añadida con éxito
 *         400:
 *           description: Error al subir la firma
 *         404:
 *           description: Nota de entrega no encontrada
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.patch('/sign/:id', uploadMiddlewareMemory.single("image"), authMiddleware, checkRol("admin"),
    findDeliveriNoteIdParam, DeliveryNoteUserStatus(true), createSinged);
/**
 * @swagger
 *   /api/deliveryNote/{id}:
 *     delete:
 *       tags: [DeliveryNote]
 *       summary: Elimina una nota de entrega
 *       description: Elimina una nota de entrega específica
 *       operationId: deleteDeliveryNote
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: ID de la nota de entrega a eliminar
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Nota de entrega eliminada
 *         404:
 *           description: Nota de entrega no encontrada
 *         401:
 *           description: No autorizado
 *         403:
 *           description: Acceso prohibido
 *     security:
 *       - bearerAuth: []
 */
reouterDeliveryNote.delete('/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), deleteDeliveryNote);
/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryNote:
 *       type: object
 *       required:
 *         - clientId
 *         - projectId
 *         - items
 *       properties:
 *         clientId:
 *           type: string
 *           example: "6810c8638e0c578ef8121698"
 *         projectId:
 *           type: string
 *           example: "6810c8908e0c578ef81216b6"
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "hour"
 *               hours:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Descripción de la tarea"
 */

module.exports = reouterDeliveryNote;