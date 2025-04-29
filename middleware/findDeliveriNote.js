
const { verifyToken } = require("../utils/handleJwt")
const ProjectModel = require("../models/projects")
const ClientModel = require("../models/client")
const DeliveryNoteModel = require("../models/deliveryNote.js");
const { matchedData } = require("express-validator")
const { isValidObjectId } = require('mongoose');

const findDeliveriNoteUserIdClientIdProyectId = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const userId = data.userId;
        const projectId = data.projectId;
        const clientId = data.clientId;
        const deliveryNote = await DeliveryNoteModel.findOne({ userId: userId, projectId: projectId, clientId: clientId });
        req.deliveryNote = deliveryNote;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findAllDeliveriNoteUserId = async (req, res, next) => {
    const userId = req.user._id
    try {
        const deliveryNotes = await DeliveryNoteModel.find({ userId: userId });
        if (deliveryNotes.length === 0) {
            return res.status(404).json({ error: "Albaranes No Encontrados" });
        }
        req.deliveryNotes = deliveryNotes;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const findDeliveriNoteIdParam = async (req, res, next) => {
    try {
        const deliveryNoteId = req.params.id
        if (!isValidObjectId(deliveryNoteId)) {
            return res.status(400).json({ error: "ID inválido" });
        }

        const deliveryNote = await DeliveryNoteModel.findById(deliveryNoteId)
        if (!deliveryNote) {
            return res.status(404).json({ error: "Albaran No Encontrado" });
        }
        req.deliveryNote = deliveryNote;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const DeliveryNoteUserStatus = (status) => async (req, res, next) => {
    try {
        const deliveryNote = req.deliveryNote
        const userId = req.user._id
        if (deliveryNote) {
            if (userId.equals(deliveryNote.userId) === status) {
                next()
            } else if (status === false) {
                res.status(400).json({ error: "El Albaran Pertenece Al Clinte" });
            } else {
                res.status(400).json({ error: "El Albaran No Pertenece Al Clinte" });
            }
        } else {
            if (status === false) {
                next()
            } else {
                res.status(400).json({ error: "El Albaran No Existe/No pertenece al Clinte" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
module.exports = { findDeliveriNoteUserIdClientIdProyectId, findDeliveriNoteIdParam, findAllDeliveriNoteUserId, DeliveryNoteUserStatus }