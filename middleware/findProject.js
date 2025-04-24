
const { verifyToken } = require("../utils/handleJwt")
const ProjectModel = require("../models/projects")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findProjectProjectCode = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const projectCode = data.projectCode;
        const project = await ProjectModel.findOne({ projectCode: projectCode });
        if (project) {
            req.project = project;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const findProyectIdParams = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        req.project = project
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const findProyectId = async (req, res, next) => {
    try {
        const data = matchedData(req)
        const projectId = data.projectId;
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        req.project = project
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const findProjectsId = async (req, res, next) => {
    try {
        const clients = req.clients
        const totalProjects = await Promise.all(
            clients.map(client =>
                ProjectModel.find({ clientId: client._id })
            )
        );
        if (!totalProjects) {
            return res.status(404).json({ message: 'NO HAY PROYECTOS ASOCIADOS' });
        }
        req.projects = totalProjects
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



module.exports = { findProjectProjectCode,findProyectId, findProyectIdParams, findProjectsId }