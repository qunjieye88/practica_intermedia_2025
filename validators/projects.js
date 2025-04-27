const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const validatorRegisterProject = [
    check("name").exists().notEmpty(),
    check("projectCode").exists().notEmpty(),
    check("email").exists().notEmpty().isEmail(),
    check("code").exists().notEmpty(),
    check("clientId").exists().notEmpty(),    
    check("address.street").exists().notEmpty(),
    check("address.number").exists().notEmpty(),
    check("address.postal").exists().isPostalCode("ES"),
    check("address.city").exists().notEmpty(),
    check("address.province").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorUpdateProject = [
    check("name").optional().notEmpty(),
    check("projectCode").optional().notEmpty(),
    check("email").optional().notEmpty().isEmail(),
    check("code").optional().notEmpty(),
    check("notes").optional().notEmpty(),
    check("clientId").optional().notEmpty(),    
    check("address.street").optional().notEmpty(),
    check("address.number").optional().notEmpty(),
    check("address.postal").optional().isPostalCode("ES"),
    check("address.city").optional().notEmpty(),
    check("address.province").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {validatorRegisterProject,validatorUpdateProject}