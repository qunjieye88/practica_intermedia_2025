const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const DeliveryNoteModel = require("../models/deliveryNote.js");
const { encrypt } = require("../utils/handlePassword")

/*

error: cliente no asociado a usuario
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");

error: falta token

        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');

error: token mal escrito

        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");


    user.role = "user"
    const userUpdated = await user.save();

error: sin permisos
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");

    
error: campos incorrectos
    
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');


    
    expect(response.body).toHaveProperty('user');
    expect(response.body.error).toBe("Error de autenticacion");

*/

const createUser = async (num) => {

    const data = {
        name: `${num}`,
        nif: "40000000Q",
        email: `${num}@correo.es`,
        password: await encrypt("12345678"),
        emailCode: 999999,
        status: 1,
        role: "admin"
    }
    const user = await UserModel.create(data);
    return user
}

const createClient = async (num, userId) => {
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

    const client = await ClientModel.create(data);
    return client;
}

const createProject = async (num, userId, clientId) => {
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


    const project = await ProjectModel.create(data);
    return project;
}

const createDeliveryNote = async ( userId, clientId, projectId) => {
    const data = {
        clientId: clientId,
        projectId: projectId,
        userId: userId,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    };


    const deliveryNote = await DeliveryNoteModel.create(data);
    return deliveryNote;
}

module.exports = { createUser, createProject, createClient, createDeliveryNote }