const { matchedData } = require("express-validator");
const ProjectModel = require("../models/projects");
const ClientModel = require("../models/client");
const mongoose = require('mongoose');
const { isValidObjectId } = require('mongoose');

const createProject = async (req, res) => {//hecho
    try {
        const userId = req.user._id
        const client = req.client
        req = matchedData(req)
        const projectCode = req.projectCode;
        const project = await ProjectModel.findOne({ projectCode: projectCode });
        if (project) {
            return res.status(404).send({ error: "Proyecto Creado" });
        }
        if (!client) {
            return res.status(404).send({ error: "Cliente no pertenece al usuario" });
        }
        req.clientId = new mongoose.Types.ObjectId(req.clientId)
        const newProject = await ProjectModel.create({...req,userId});
        res.status(200).send({ project: newProject });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
                return res.status(500).send({ error: "El Codigo del Proyecto Ya Existe" });
            }
        }
        project.set(req);
        const updateProject = await project.save();
        res.status(200).send(updateProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getProjects = async (req, res) => {
    try {
        const projects = req.projects
        res.status(200).send({ projects: projects });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getProject = async (req, res) => {
    try {
        const project = req.project
        res.status(200).send({ project: project });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            res.status(200).json({ project: deletedProject, message: 'Cliente eliminado permanentemente (hard delete)' });
        }
    } catch (err) {
        res.status(500).json({ error: error.message });
    }
};

const restoreProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const restored = await ProjectModel.restore({ _id: projectId });
        res.status(200).json({ message: "Proyecto restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createProject, updateProyect, getProjects,
    getProject, deleteProject, restoreProject
}
