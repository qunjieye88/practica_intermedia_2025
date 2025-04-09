const express = require('express');
const { registerCtrl, validatorUser, loginUser,
    updateUser, patchCompany,
    patchLogo, getUser, deleteUser,
    getCodePassword, getPassword, createInvitation,
    getUsers } = require("../controllers/user.js")
const {
    validatorRegister, validatorValidator, validatorLogin,
    validatorUpdate, validatorCompany, validatorCodePassword,
    validatorPassword, validatorInviteUser
} = require("../validators/user.js")
const { uploadMiddlewareMemory } = require("../utils/handleStorage.js")


const { checkRol,checkRolNot } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findUserEmail } = require("../middleware/findUserEmail.js")

const routerUser = express.Router();

routerUser.use(express.json())
/**
* @openapi
* /api/user/register:
*   post:
*       tags:
*           - User
*       summary: "Get all users"
*       description: "Retrieve a list of registered users."
*       responses:
*           '200':
*               description: "Returns a list of users"
*           '401':
*               description: "Unauthorized - Missing or invalid token"
*           security:
*               - bearerAuth: []
*/
routerUser.post('/register', validatorRegister, registerCtrl)//hecho
routerUser.put('/validation', validatorValidator,authMiddleware, validatorUser)//hecho
routerUser.post('/login', validatorLogin,findUserEmail, loginUser)//hecho
routerUser.put('/register', validatorUpdate,authMiddleware, updateUser)//hecho
routerUser.patch('/company', validatorCompany,authMiddleware,checkRolNot("guest"), patchCompany)//hecho
routerUser.patch('/logo', uploadMiddlewareMemory.single("image"),authMiddleware, patchLogo)//hecho
routerUser.get('/',authMiddleware, getUser)//hecho
routerUser.delete('/',authMiddleware, deleteUser)//hecho
routerUser.get('/codePassword', validatorCodePassword, getCodePassword)
routerUser.patch('/password', validatorPassword, getPassword)
routerUser.post('/invite', validatorInviteUser, createInvitation)
routerUser.get('/users', getUsers)
//patch es actualizar
//put es remplazar

module.exports = routerUser;