const { matchedData } = require("express-validator");
const mongoose = require('mongoose');
const ClientModel = require("../models/client.js");

const createClient = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        req = matchedData(req);
        const cif = req.cif;
        const client = await ClientModel.findOne({ cif: cif, userId: userId })
        if (client) {
            return res.status(400).send({ error: "El Cliente Pertenece Al Usuario" });
        }
        const newnueClient = await ClientModel.create({
            ...req,
            userId: new mongoose.Types.ObjectId(userId)
        });
        res.status(200).send({ client: newnueClient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateClient = async (req, res) => {//hecho
    try {
        const client = req.client
        req = matchedData(req)
        if (!client) {
            res.status(400).send({ error: "Error Obtener Cliente" });
        }
        client.set(req);
        const updateClient = await client.save();
        res.status(200).send({ client: updateClient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getClients = async (req, res) => {
    try {
        const clients = req.clients
        res.status(200).send({ clients: clients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getClient = async (req, res) => {
    try {
        const client = req.client
        res.status(200).send({ client: client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteClient = async (req, res) => {
    try {
        const client = req.client;
        if (req.query.soft === "true") {
            const deletedClient = await client.delete();
            res.status(200).json({ client: deletedClient, message: 'Cliente eliminado (soft delete)' });
        } else {
            const deletedClient = await ClientModel.findByIdAndDelete(client._id); // Hard delete
            res.status(200).json({ client: deletedClient, message: 'Cliente eliminado permanentemente (hard delete)' });

        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const restoreClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const restored = await ClientModel.restore({ _id: clientId });
        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: "Cliente no encontrado o ya activo" });
        }
        res.status(200).json({ message: "Cliente restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createClient, updateClient, getClients,
    getClient, deleteClient, restoreClient
}
