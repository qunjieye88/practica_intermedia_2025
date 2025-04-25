const { matchedData } = require("express-validator");
const ClientModel = require("../models/client.js");
const mongoose = require('mongoose');
const createClient = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        req = matchedData(req)
        const newUser = await ClientModel.create({
            ...req,
            userId: new mongoose.Types.ObjectId(userId)
        });
        res.status(200).send(newUser);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

const updateClient = async (req, res) => {//hecho
    try {
        const client = req.client
        req = matchedData(req)
        client.set(req);
        const updateClient = await client.save();
        res.status(200).send(updateClient);
    } catch (error) {
        res.status(500).send({ message: "Error Actualizar" });
    }
}

const getClients = async (req, res) => {
    try {
        const clients = req.clients
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send({ message: "Error Obtener Cliente" });
    }
}

const getClient = async (req, res) => {
    try {
        const client = req.client
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send({ message: "Error Obtener Clientes" });
    }
}

const deleteClient = async (req, res) => {
    try {
        const client = req.client;
        if (req.query.soft === "true") {
            await client.delete();
            res.status(200).json({ client, message: 'Cliente eliminado (soft delete)' });
        } else {
            const deletedClient = await ClientModel.findByIdAndDelete(client._id); // Hard delete
            if (!deletedClient) {
                res.status(404).json({ message: 'Cliente no encontrado' });
            } else {
                res.status(200).json({ client: deletedClient, message: 'Cliente eliminado permanentemente (hard delete)' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el Cliente' });
    }
};

const restoreClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const restored = await ClientModel.restore({ _id: clientId });
        const client = await ClientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Cliente no encontrado o ya activo" });
        }
        res.status(200).json({ message: "Cliente restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restaurar el cliente", error });
    }
};


module.exports = {
    createClient, updateClient, getClients,
    getClient, deleteClient, restoreClient
}
