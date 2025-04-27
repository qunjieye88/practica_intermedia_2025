const DeliveryNoteModel = require("../models/deliveryNote.js");
const { matchedData } = require("express-validator")

const createDeliveryNote = async (req, res) => {
    try {
        const deliveryNote = req.deliveryNote;
        req = matchedData(req)
        if (deliveryNote) {
            return res.status(400).send({ message: "Albaran ya creado" });
        }

        const createDeliveryNote = DeliveryNoteModel.create(req)
        res.status(201).json(createDeliveryNote);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

const getDeliveryNotes = async (req, res) => {
    try {
        const deliveryNotes = req.deliveryNotes;

        if (deliveryNotes.length === 0) {
            return res.status(400).send({ message: "No hay albaranes" });
        }
        res.status(200).json(deliveryNotes);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

const getDeliveryNote = async (req, res) => {
    try {
        const deliveryNote = req.deliveryNote;

        if (deliveryNote.length) {
            return res.status(400).send({ message: "No hay albaranes" });
        }
        res.status(200).json(deliveryNote);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el albarán", error: error.message });
    }
};

module.exports = {
    createDeliveryNote,getDeliveryNotes,getDeliveryNote
}