const express = require('express');

const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findUserId } = require("../middleware/findUser.js")
const { findClientCif, findClientIdParams, findClientId, findClientsUserId, ClientUserStatus } = require("../middleware/findClient.js")
const { findProjectProjectCode, findProyectId, findProjectsId, ProjectUserStatus, projectClientStatus } = require("../middleware/findProject.js")
const { findDeliveriNoteUserIdClientIdProyectId, findAllDeliveriNoteUserId,findDeliveriNoteIdParam } = require("../middleware/findDeliveriNote.js")
const { createDeliveryNote, getDeliveryNotes,getDeliveryNote } = require("../controllers/deliveryNote.js")
const { createDeliveryNoteValidator } = require("../validators/deliveryNote.js")


const reouterDeliveryNote = express.Router();

reouterDeliveryNote.use(express.json())
reouterDeliveryNote.post('/', createDeliveryNoteValidator, authMiddleware,
    checkRol("admin"), findClientId, findProyectId, findUserId, ClientUserStatus(true),
    projectClientStatus(true), findDeliveriNoteUserIdClientIdProyectId,
    createDeliveryNote)

reouterDeliveryNote.get('/', authMiddleware, checkRol("admin"), findAllDeliveriNoteUserId, getDeliveryNotes);
reouterDeliveryNote.get('/:id', authMiddleware, checkRol("admin"),findDeliveriNoteIdParam, getDeliveryNote);

/*reouterDeliveryNote.get('/:id', deliveryNoteController.getDeliveryNoteById);

reouterDeliveryNote.get('/pdf/:id', deliveryNoteController.getDeliveryNotePdf);

reouterDeliveryNote.post('/sign/:id', deliveryNoteController.signDeliveryNote);

reouterDeliveryNote.delete('/:id', deliveryNoteController.deleteDeliveryNote);*/

module.exports = reouterDeliveryNote;