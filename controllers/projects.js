const { matchedData } = require("express-validator");
const ProjectModel = require("../models/projects");
const mongoose = require('mongoose');
const createProject = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        const clientes = req.clientes
        const project = req.project
        req = matchedData(req)
        
        if(project){
            return res.status(404).send({ message: "Proyecto Creado" });
        }
        if (clientes) {
            const clienteExistente = clientes.some(cliente => cliente.userId.equals(userId));
            if (!clienteExistente) {
                return res.status(404).send({ message: "Cliente no pertenece al usuario" });
            }
        }
        req.clientId = new mongoose.Types.ObjectId(req.clientId)
        const newUser = await ProjectModel.create(req);
        res.status(200).send(newUser);
    } catch (error) {
        res.status(500).send({ message: "Error Crear" });
    }
}

const updateClient = async (req, res) => {//hecho
    try {
        const client = req.client
        const userId = req.user._id
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
            const deletedClient = await ProjectModel.findByIdAndDelete(client._id); // Hard delete
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
        const restored = await ProjectModel.restore({ _id: clientId });

        if (!restored) {
            return res.status(404).json({ message: "Cliente no encontrado o ya activo" });
        }

        res.status(200).json({ message: "Cliente restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restaurar el cliente", error });
    }
};


module.exports = {
    createProject, updateClient, getClients,
    getClient, deleteClient, restoreClient
}
