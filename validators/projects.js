const { check } = require("express-validator")

const validatorRegister = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength({ min: 8, max: 16 }),
    check("proyectCode").exists().notEmpty(),
    check("address").exists().notEmpty(),
    check("code").exists().notEmpty(),
    check("clientId").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorPut = [
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


module.exports = {
}