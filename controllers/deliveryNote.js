const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const { matchedData } = require("express-validator")
const { encrypt, compare, hola } = require("../utils/handlePassword")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const { uploadToPinata } = require("../utils/handleUploadIPFS.js");

const createDeliveryNote = async (req, res) => {
    try {
        req = matchedData(req)
        const clientId = req.clientId;
        const projectId = req.projectId;
        const entries = req.entries;
        const project = await ProjectModel.findOne({_id:projectId,clientId:clientId})
        if(!project){
            return res.status(400).json({ message: "Proyecto no pertenece al cliente" });
        }
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ message: "Debes incluir al menos una entrada." });
        }

        const newNote = await DeliveryNote.create({
            clientId,
            projectId,
            entries,
        });

        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

module.exports = {
    createDeliveryNote
}