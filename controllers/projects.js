const { matchedData } = require("express-validator");
const ProjectModel = require("../models/projects");
const ClientModel = require("../models/client");
const mongoose = require('mongoose');
const createProject = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        const client = req.client
        const project = req.project
        req = matchedData(req)
        if (project) {
            return res.status(404).send({ message: "Proyecto Creado" });
        }
        if (!client) {
            return res.status(404).send({ message: "Cliente no pertenece al usuario" });

        }
        req.clientId = new mongoose.Types.ObjectId(req.clientId)
        const newUser = await ProjectModel.create(req);
        res.status(200).send(newUser);
    } catch (error) {
        res.status(500).send({ message: "Error Crear" });
    }
}

const updateProyect = async (req, res) => {//hecho
    try {
        const project = req.project
        const projectId = req.params.id;
        req = matchedData(req)

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        const clientId = req.clientId
        if (clientId) {
            const client = await ClientModel.findById(clientId);
            if (!client) {
                return res.status(500).send({ message: "Cliente Id No Existe" });
            }
        }
        const projectCode = req.projectCode
        if (projectCode) {
            const proyectoExistente = await ProjectModel.findOne({ projectCode });
            if (proyectoExistente && !proyectoExistente._id.equals(projectId)) {
                return res.status(500).send({ message: "El Codigo del Proyecto Ya Existe" });
            }
        }
        project.set(req);
        const updateProject = await project.save();
        res.status(200).send(updateProject);
    } catch (error) {
        res.status(500).send({ message: "Error Actualizar" });
    }
}

const getProjects = async (req, res) => {
    try {
        const projects = req.projects
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send({ message: "Error Obtener Cliente" });
    }
}

const getProject = async (req, res) => {
    try {
        const project = req.project
        res.status(200).send(project);
    } catch (error) {
        res.status(500).send({ message: "Error Obtener Clientes" });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = req.project;
        if (req.query.soft === "true") {
            await project.delete();
            res.status(200).json({ project, message: 'Cliente eliminado (soft delete)' });
        } else {
            const deletedProject = await ProjectModel.findByIdAndDelete(project._id); // Hard delete
            if (!deletedProject) {
                res.status(404).json({ message: 'Proyecto no encontrado' });
            } else {
                res.status(200).json({ project: deletedProject, message: 'Cliente eliminado permanentemente (hard delete)' });
            }
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el Cliente' });
    }
};

const restoreProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const restored = await ProjectModel.restore({ _id: projectId });
        if (!restored) {
            return res.status(404).json({ message: "Cliente no encontrado o ya activo" });
        }

        res.status(200).json({ message: "Cliente restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al restaurar el cliente", error });
    }
};


module.exports = {
    createProject, updateProyect, getProjects,
    getProject, deleteProject, restoreProject
}
