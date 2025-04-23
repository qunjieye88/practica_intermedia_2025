
const { verifyToken } = require("../utils/handleJwt")
const ProjectModel = require("../models/projects")
const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")

const findProjectProjectCode = async (req, res, next) => {
    try {
        const data = matchedData(req);
        const projectCode = data.projectCode;
        console.log(projectCode)
        const project = await ProjectModel.findOne({projectCode:projectCode});
        if (project) {
            console.log(project)
            req.project = project;
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


module.exports = { findProjectProjectCode}