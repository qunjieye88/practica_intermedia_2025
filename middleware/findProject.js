
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
const ProjectUserStatus = (status)=> async (req, res, next) => {

    try {
        const userId = req.user._id;
        const project = req.project

        const client = await ClientModel.findOne({_id:project.clientId, userId: userId})

        if (client) {
            if (userId.equals(client.userId) === status) {
                next()
            } else if (status === false) {
                res.status(400).json({ message: "El Proyecto Pertenece Al Usuario" });
            } else {
                res.status(400).json({ message: "El Proyecto No Pertenece Al Usuario" });
            }
        } else {
            if (status === false) {
                next()
            } else {
                res.status(400).json({ message: "El Proyecto No Existe/No pertenece al usuaro" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}




module.exports = { findProjectProjectCode,ProjectUserStatus, findProyectId, findProyectIdParams, findProjectsId }