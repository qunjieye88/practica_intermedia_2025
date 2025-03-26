const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const validatorRegister = [
    check("email", "Estructura incorrecta").exists().notEmpty().isEmail(),
    check("password", "Estructura incorrecta").exists().notEmpty().isLength({ min: 8, max: 16 }),
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
    check("email").optional().notEmpty().isEmail(),
    check("name").optional().notEmpty().isString(),
    check("surnames").optional().notEmpty().isString(),
    check("nif").optional().notEmpty().matches(/^[0-9]{8}[A-Z]$/),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompany = [
    check("company.name").optional().notEmpty(),
    check("company.cif").optional().notEmpty().isLength({ min: 9, max: 9 }),
    check("company.street").optional().notEmpty(),
    check("company.number").optional().isInt({ min: 1 }),
    check("company.postal").optional().isPostalCode("ES"),
    check("company.city").optional().notEmpty(),
    check("company.province").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


module.exports = { validatorRegister, validatorLogin, validatorValidator, validatorUpdate, validatorCompany }