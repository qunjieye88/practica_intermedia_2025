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

const validatorPutProyect = [
    check("email").optional().notEmpty().isEmail(),
    check("password").optional().notEmpty().isLength({ min: 8, max: 16 }),
    check("proyectCode").optional().notEmpty(),
    check("address").optional().notEmpty(),
    check("code").optional().notEmpty(),
    check("clientId").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


module.exports = {validatorRegisterProject}