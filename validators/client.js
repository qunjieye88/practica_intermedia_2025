const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const createValidator = [
    check("logo").optional().notEmpty(),
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

module.exports = {createValidator}