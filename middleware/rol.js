const { handleHttpError } = require("../utils/handleStorage.js")

const checkRol = (roles) => (req, res, next) => {
    const user = req.user
    if (user.role.includes(roles)) {
        next()
    } else {
        handleHttpError(res, "ERROR PERMISO", 403)
    }
    //console.log(req.authorization)
}

const checkRolNot = (roles) => (req, res, next) => {
    const user = req.user
    if (user.role.includes(roles)) {
        handleHttpError(res, "ERROR PERMISO", 403)
    } else {
        next()
    }
    //console.log(req.authorization)
}

module.exports = { checkRol,checkRolNot }