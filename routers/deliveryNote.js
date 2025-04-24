const express = require('express');

const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findClientCif,findClientIdParams,findClientId,findClientsUserId } = require("../middleware/findClient.js")
const { findProjectProjectCode,findProyectId,findProjectsId } = require("../middleware/findProject.js")
const {} = require("../middleware/findDeliveriNote.js")
const {} = require("../controllers/deliveryNote.js")
const {createDeliveryNoteValidator} = require("../validators/deliveryNote.js")


const reouterDeliveryNote = express.Router();

reouterDeliveryNote.use(express.json())
reouterDeliveryNote.post('/',createDeliveryNoteValidator,authMiddleware,findClientId,findProyectId,)


module.exports = reouterDeliveryNote;