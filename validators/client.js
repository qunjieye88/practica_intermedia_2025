const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")


const createValidator = [
    check("name").exists().notEmpty(),
    check("cif").exists().notEmpty().isLength({ min: 9, max: 9 }),
    check("address.street").exists().notEmpty(),
    check("address.number").exists().notEmpty(),
    check("address.postal").exists().isPostalCode("ES"),
    check("address.city").exists().notEmpty(),
    check("address.province").exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const updateClientValidator = [
    check("name").optional().notEmpty(),
    check("address.street").optional().notEmpty(),
    check("address.number").optional().notEmpty(),
    check("address.postal").optional().isPostalCode("ES"),
    check("address.city").optional().notEmpty(),
    check("address.province").optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

module.exports = {createValidator,updateClientValidator}