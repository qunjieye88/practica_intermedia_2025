const express = require('express');
const { registerCtrl, validatorUser, loginUser,
    updateUser, patchCompany,
    patchLogo, getUser, deleteUser,
    getCodePassword, getPassword, createInvitation,
    getUsers, deleteAllUsers } = require("../controllers/user.js")
const {
    validatorRegister, validatorValidator, validatorLogin,
    validatorUpdate, validatorCompany, validatorCodePassword,
    validatorPassword, validatorInviteUser
} = require("../validators/user.js")
const { uploadMiddlewareMemory } = require("../utils/handleStorage.js")
const { checkRol } = require("../middleware/rol.js")
const { authMiddleware } = require("../middleware/session.js")
const { findUserEmail } = require("../middleware/findUser.js")
const routerUser = express.Router();
routerUser.use(express.json())
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints relacionados con los usuarios
 */
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos
 */
routerUser.post('/register', validatorRegister, registerCtrl)//hecho
/**
 * @swagger
 * /api/user/validation:
 *   put:
 *     tags: [User]
 *     summary: Validar usuario mediante token
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserValidation'
 *     responses:
 *       200:
 *         description: Usuario validado
 *       400:
 *         description: Código inválido
 *       401:
 *         description: No autorizado
 */
routerUser.put('/validation', validatorValidator, authMiddleware, validatorUser)//hecho
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 */
routerUser.post('/login', validatorLogin, findUserEmail, loginUser)//hecho
/**
 * @swagger
 * /api/user/register:
 *   put:
 *     tags: [User]
 *     summary: Actualizar información del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
routerUser.put('/register', validatorUpdate, authMiddleware, updateUser)//hecho
/**
 * @swagger
 * /api/user/company:
 *   patch:
 *     tags: [User]
 *     summary: Modificar información de la empresa (admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyUpdate'
 *     responses:
 *       200:
 *         description: Información de empresa actualizada
 *       403:
 *         description: Solo accesible por administradores
 */
routerUser.patch('/company', validatorCompany, authMiddleware, checkRol("admin"), patchCompany)//hecho
routerUser.patch('/logo', uploadMiddlewareMemory.single("image"), authMiddleware, patchLogo)//hecho
routerUser.get('/', authMiddleware, getUser)//hecho
routerUser.delete('/', authMiddleware, deleteUser)//hecho
routerUser.get('/codePassword', validatorCodePassword, getCodePassword)
routerUser.patch('/password', validatorPassword, getPassword)
routerUser.post('/invite', validatorInviteUser, createInvitation)
routerUser.get('/users', getUsers)

routerUser.delete('/deleteAllUsers', deleteAllUsers)

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: 12345678
 *         name:
 *           type: string
 *           example: Juan Pérez

 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: user@example.com
 *         password:
 *           type: string
 *           example: 12345678

 *     UserProfileUpdate:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - surnames
 *         - nif
 *       properties:
 *         email:
 *           type: string
 *           example: miemail@gmail.com
 *         name:
 *           type: string
 *           example: José
 *         surnames:
 *           type: string
 *           example: García Pérez
 *         nif:
 *           type: string
 *           example: 40000000W

 *     UserValidation:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: 123456

 *     CompanyUpdate:
 *       type: object
 *       required:
 *         - company
 *       properties:
 *         company:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: Calle Mayor
 *             number:
 *               type: integer
 *               example: 22
 *             postal:
 *               type: integer
 *               example: 28013
 *             city:
 *               type: string
 *               example: Madrid
 *             province:
 *               type: string
 *               example: Madrid
 *             name:
 *               type: string
 *               example: Mi Empresa
 *             cif:
 *               type: string
 *               example: B12345678
 */


module.exports = routerUser;