const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const DeliveryNoteModel = require("../models/deliveryNote.js");
const { tokenSign } = require("../utils/handleJwt.js")
const { createClient, createUser, createProject, createDeliveryNote } = require("../utils/create.js")

const api = supertest(app);

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await UserModel.deleteMany({})
    await ClientModel.deleteMany({})
    await ProjectModel.deleteMany({})
    await DeliveryNoteModel.deleteMany({})
})
it('post http://localhost:3000/api/deliveryNote error: cliente no asociado al usuario', async () => {
    const num = 0
    const user = await createUser(num, null);
    const userAux = await createUser(-9999 + num, null);
    const client = await createClient(num, null, userAux._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Cliente No Pertenece Al Usuario");
});

it('post http://localhost:3000/api/deliveryNote error: proyecto no pertenece al usuario', async () => {
    const num = 1
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const clientAux = await createClient(-9999 + num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: clientAux._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Proyecto No Pertenece Al Clinte");
});
it('post http://localhost:3000/api/deliveryNote error: albaran ya creado', async () => {
    const num = 2
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(null, user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Albaran ya creado");
});

it('post http://localhost:3000/api/deliveryNote error: faltan datos', async () => {
    const num = 3
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});



it('post http://localhost:3000/api/deliveryNote sin error entrada simple', async () => {
    const num = 4
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
});

it('post http://localhost:3000/api/deliveryNote error: typo incorrecto(hour)', async () => {
    const num = 5
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "quantity": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/deliveryNote error: typo incorrecto(material)', async () => {
    const num = 6
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "material",
            "hour": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/deliveryNote sin error entrada multiple', async () => {
    const num = 7
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        userId: user._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "material"
        }, {
            "type": "material",
            "quantity": 2,
            "description": "hola"
        }, {
            "type": "hour",
            "hours": 2,
            "description": "adios"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(201)
        .expect('Content-Type', /application\/json/)
});
//Listar albaranes: GET /api/deliverynote
it('get http://localhost:3000/api/deliveryNote error: usuario sin albaranes', async () => {
    const num = 8
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})

it('get http://localhost:3000/api/deliveryNote error: sin token', async () => {
    const num = 9
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(null, user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/deliveryNote error: autentificar token', async () => {
    const num = 10
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(null, user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});



it('get http://localhost:3000/api/deliveryNote sin error', async () => {
    const num = 11
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(null, user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})
