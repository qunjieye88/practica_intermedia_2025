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

reouterDeliveryNote.use(express.json())

reouterDeliveryNote.post('/', createDeliveryNoteValidator, authMiddleware, checkRol("admin"),
    findClientId, findProyectId, ClientUserStatus(true), projectClientStatus(true), createDeliveryNote)
reouterDeliveryNote.get('/', authMiddleware, checkRol("admin"), findAllDeliveriNoteUserId, getDeliveryNotes);
reouterDeliveryNote.get('/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), getDeliveryNote);
reouterDeliveryNote.get('/pdf/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), createPDF);
reouterDeliveryNote.patch('/sign/:id', uploadMiddlewareMemory.single("image"), authMiddleware, checkRol("admin"),
    findDeliveriNoteIdParam, DeliveryNoteUserStatus(true), createSinged);
reouterDeliveryNote.delete('/:id', authMiddleware, checkRol("admin"), findDeliveriNoteIdParam,
    DeliveryNoteUserStatus(true), deleteDeliveryNote);

module.exports = reouterDeliveryNote;