const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const validatorRegister = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
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
    check("company").optional().notEmpty().isString(),
    check("name").optional().notEmpty().isString(),
    check("surnames").optional().notEmpty().isString(),
    check("cif").optional().notEmpty().matches(/^[0-9]{8}[A-Z]$/),
    check("role").optional().notEmpty().isIn(["admin", "user"]),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCompany = [
    check("company.name").optional().notEmpty(),
    check("company.cif").optional().notEmpty().isLength({ min: 9, max: 9 }),
    check("company.street").exists().notEmpty(),
    check("company.number").exists().isInt({ min: 1 }),
    check("company.postal").exists().isPostalCode("ES"),
    check("company.city").exists().notEmpty(),
    check("company.province").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCodePassword = [
    check("email").exists().notEmpty().isEmail(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]


const validatorPassword = [
    check("email").exists().notEmpty().isEmail(),
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorInviteUser = [
    check("email").exists().notEmpty().isEmail(),
    check("company.name").exists().notEmpty(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {
    validatorRegister, validatorLogin, validatorValidator,
    validatorUpdate, validatorCompany, validatorCodePassword,
    validatorPassword, validatorInviteUser
}