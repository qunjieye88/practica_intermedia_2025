const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const { encrypt} = require("../utils/handlePassword")



const createUser = async (num, _id) => {

    const data = {
        name: `${num}`,
        nif: "40000000Q",
        email: `${num}@correo.es`,
        password: await encrypt("12345678"),
        emailCode: 999999,
        status: 1,
        role: "admin"
    }

    if (_id) {
        data._id = _id
    }
    const user = await UserModel.create(data);
    return user
}

const createClient = async (num, _id, userId) => {
    const data = {
        name: `${num}`,
        cif: `S0000000${num}`,
        address: {
            street: "Carlos V",
            number: 22,
            postal: 28936,
            city: "Móstoles",
            province: "Madrid"
        },
        userId: userId
    };

    if (_id) {
        data._id = _id;
    }

    const client = await ClientModel.create(data);
    return client;
}

const createProject = async (num, _id, userId, clientId) => {
    const data = {
        name: `${num}`,
        projectCode: `Identificador: ${num}`,
        email: `${num}@correo.es`,
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: `${num}`,
        clientId: clientId,
        userId: userId
    };

    if (_id) {
        data._id = _id;
    }

    const project = await ProjectModel.create(data);
    return project;
}

module.exports = {createUser,createProject,createClient}