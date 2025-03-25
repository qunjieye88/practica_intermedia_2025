const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const validatorRegister = [
    check("email","Estructura incorrecta").exists().notEmpty().isEmail(),
    check("password","Estructura incorrecta").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorValidator = [
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]
const validatorUpdate = [
    check("email").exists().notEmpty().isEmail(),
    check("name").optional().notEmpty().isString(),
    check("surnames").optional().notEmpty().isString(),
    check("nif").optional().notEmpty().matches(/^[0-9]{8}[A-Z]$/),
    (req, res, next) => {
        console.log("hola")
        return validateResults(req, res, next)
    }
]

module.exports = { validatorRegister, validatorLogin,validatorValidator ,validatorUpdate}