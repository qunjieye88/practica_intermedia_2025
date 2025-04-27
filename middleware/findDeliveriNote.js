
const { verifyToken } = require("../utils/handleJwt")
const ProjectModel = require("../models/projects")
const ClientModel = require("../models/client")
const DeliveryNoteModel = require("../models/deliveryNote.js");
const { matchedData } = require("express-validator")

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
        const deliveryNotes = await DeliveryNoteModel.find({userId:userId});
        req.deliveryNotes = deliveryNotes;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const findDeliveriNoteIdParam = async (req, res, next) => {
    try {
        const deliveryNoteId = req.params.id
        const deliveryNote = await DeliveryNoteModel.findById(deliveryNoteId);
        req.deliveryNote = deliveryNote;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { findDeliveriNoteUserIdClientIdProyectId,findDeliveriNoteIdParam,findAllDeliveriNoteUserId}