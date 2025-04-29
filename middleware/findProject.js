
const ProjectModel = require("../models/projects")
const ClientModel = require("../models/client")
const { matchedData } = require("express-validator")
const { isValidObjectId } = require('mongoose');

const findProjectProjectCode = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const projectCode = data.projectCode;
        const project = await ProjectModel.findOne({ projectCode: projectCode });
        if (!project) {
            return res.status(400).json({ error: "Proyecto No Encontrado" });
        }
        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findProyectIdParams = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        if (!isValidObjectId(projectId)) {
            return res.status(400).json({ error: "ID inválido" });
        }
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(400).json({ error: "Proyecto No Encontrado" });
        }
        req.project = project
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const findProyectId = async (req, res, next) => {
    try {
        const data = matchedData(req)
        const projectId = data.projectId;
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(400).json({ error: "Proyecto No Encontrado" });
        }
        req.project = project
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const findProjectsId = async (req, res, next) => {
    try {

        const id = req.user._id
        const clients = await ClientModel.find({ userId: id });
        if (clients.length === 0) {
            return res.status(404).json({ error: "Clientes No Encontrados" });
        }
        const totalProjects = (await Promise.all(
            clients.map(client =>
                ProjectModel.find({ clientId: client._id })
            )
        )).flat();;

        if (totalProjects.length === 0) {
            return res.status(404).json({ error: "Proyectos No Encontrados" });
        }
        req.projects = totalProjects
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const ProjectUserStatus = (status) => async (req, res, next) => {

    try {
        const userId = req.user._id;
        const project = req.project
        console.log(req.user)
        console.log(req.project)

        if (project) {
            if (userId.equals(project.userId) === status) {
                next()
            } else if (status === false) {
                res.status(400).json({ error: "El Proyecto Pertenece Al Usuario" });
            } else {
                res.status(400).json({ error: "El Proyecto No Pertenece Al Usuario" });
            }
        } else {
            if (status === false) {
                next()
            } else {
                res.status(400).json({ error: "El Proyecto No Existe/No pertenece al usuaro" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const projectClientStatus = (status) => async (req, res, next) => {

    try {
        const clientId = req.client._id;
        const project = req.project

        if (project) {
            if (clientId.equals(project.clientId) === status) {
                next()
            } else if (status === false) {
                res.status(400).json({ error: "El Proyecto Pertenece Al Clinte" });
            } else {
                res.status(400).json({ error: "El Proyecto No Pertenece Al Clinte" });
            }
        } else {
            if (status === false) {
                next()
            } else {
                res.status(400).json({ error: "El Proyecto No Existe/No pertenece al Clinte" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports = { findProjectProjectCode, ProjectUserStatus, findProyectId, findProyectIdParams, findProjectsId, projectClientStatus }