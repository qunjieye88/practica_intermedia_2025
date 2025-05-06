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
    const user = await createUser(num);
    const userAux = await createUser(-9999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
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
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");
});
it('post http://localhost:3000/api/deliveryNote error: proyecto no pertenece al usuario', async () => {
    const num = 1
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const clientAux = await createClient(-9999 + num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: clientAux._id,
        projectId: project._id,
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
    expect(response.body.error).toBe("El Proyecto No Pertenece Al Clinte");
});

it('post http://localhost:3000/api/deliveryNote error: albaran ya creado', async () => {
    const num = 2
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
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
    expect(response.body.error).toBe("Albaran ya creado");
});

it('post http://localhost:3000/api/deliveryNote error: falta token', async () => {
    const num = 3
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .send(data)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('post http://localhost:3000/api/deliveryNote error: token mal escrito', async () => {
    const num = 4
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }]
    }
    const response = await api
        .post('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}s`)
        .send(data)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('post http://localhost:3000/api/deliveryNote error: sin permisos', async () => {
    const num = 5
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
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
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('post http://localhost:3000/api/deliveryNote error: faltan datos', async () => {
    const num = 6
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        projectId: project._id,
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

it('post http://localhost:3000/api/deliveryNote error: campos incorrectos (material)', async () => {
    const num = 7
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        items: [{
            "type": "material",
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

it('post http://localhost:3000/api/deliveryNote error: campos incorrectos (hour)', async () => {
    const num = 8
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
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

it('post http://localhost:3000/api/deliveryNote sin error entrada simple', async () => {
    const num = 9
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
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
    expect(response.body).toHaveProperty('deliveryNote');
});

it('post http://localhost:3000/api/deliveryNote sin error entrada simple', async () => {
    const num = 10
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        clientId: client._id,
        projectId: project._id,
        items: [{
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }, {
            "type": "hour",
            "hours": 1,
            "description": "hola"
        }, {
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
    expect(response.body).toHaveProperty('deliveryNote');
});

//Listar albaranes: GET /api/deliverynote/:id
it('get http://localhost:3000/api/deliveryNote/:id error: falta token', async () => {
    const num = 11
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/deliveryNote/:id error: token mal escrito', async () => {
    const num = 12
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/deliveryNote/:id error: sin permisos', async () => {
    const num = 13
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});


it('get http://localhost:3000/api/deliveryNote/:id error: usuario sin albaranes', async () => {
    const num = 14
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Albaranes No Encontrados");
});

it('get http://localhost:3000/api/deliveryNote/:id sin errores', async () => {
    const num = 15
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get('/api/deliveryNote')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('deliveryNotes');
});

////Listar albaranes: GET /api/deliverynote/:Id

it('get http://localhost:3000/api/deliveryNote/:id error: albaran no pertenece a usuario', async () => {
    const num = 16
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .get(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Albaran No Pertenece Al Clinte");
});

it('get http://localhost:3000/api/deliveryNote/:id error: falta token', async () => {
    const num = 17
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/deliveryNote/:id error: token mal escrito', async () => {
    const num = 18
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/deliveryNote/:id error: sin permisos', async () => {
    const num = 19
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('get http://localhost:3000/api/deliveryNote/:id error: id incorrecto', async () => {
    const num = 20
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/${deliveryNote._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('get http://localhost:3000/api/deliveryNote/:id sin errores', async () => {
    const num = 21
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/${deliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('deliveryNote');
});

////Listar albaranes: GET /api/deliverynote/pdf/:Id

it('get http://localhost:3000/api/deliveryNote/pdf/:id error: albaran no pertenece a usuario', async () => {
    const num = 22
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Albaran No Pertenece Al Clinte");
});

it('get http://localhost:3000/api/deliveryNote/pdf/:id error: falta token', async () => {
    const num = 23
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deleteDeliveryNote._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/deliveryNote/pdf/:id error: token mal escrito', async () => {
    const num = 24
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/deliveryNote/pdf/:id error: sin permisos', async () => {
    const num = 25
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('get http://localhost:3000/api/deliveryNote/pdf/:id error: id incorrecto', async () => {
    const num = 26
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deliveryNote._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('get http://localhost:3000/api/deliveryNote/pdf/:id sin errores', async () => {
    const num = 27
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/deliveryNote/pdf/${deliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('path');
});

////Listar albaranes: patch /api/deliverynote/sign/:Id

it('patch http://localhost:3000/api/deliveryNote/sign/:id error: albaran no pertenece a usuario', async () => {
    const num = 28
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', 'firma.jpg')
        .expect(400)
    expect(response.body.error).toBe("El Albaran No Pertenece Al Clinte");
});
it('patch http://localhost:3000/api/deliveryNote/sign/:id error: falta token', async () => {
    const num = 29
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deleteDeliveryNote._id}`)
        .attach('image', 'firma.jpg')
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('patch http://localhost:3000/api/deliveryNote/sign/:id error: token mal escrito', async () => {
    const num = 30
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .attach('image', 'firma.jpg')
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/deliveryNote/sign/:id error: sin permisos', async () => {
    const num = 31
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', 'firma.jpg')
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('patch http://localhost:3000/api/deliveryNote/sign/:id error: id incorrecto', async () => {
    const num = 32
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deliveryNote._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', 'firma.jpg')
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('patch http://localhost:3000/api/deliveryNote/sign/:id sin errores', async () => {
    const num = 33
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/deliveryNote/sign/${deliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', 'firma.jpg')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

it('delete http://localhost:3000/api/deliveryNote/:id error: albaran no pertenece a usuario', async () => {
    const num = 34
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .delete(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Albaran No Pertenece Al Clinte");
});

// delete http://localhost:3000/api/deliveryNote/:id

it('delete http://localhost:3000/api/deliveryNote/:id error: falta token', async () => {
    const num = 35
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('delete http://localhost:3000/api/deliveryNote/:id error: token mal escrito', async () => {
    const num = 36
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('delete http://localhost:3000/api/deliveryNote/:id error: sin permisos', async () => {
    const num = 37
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deleteDeliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${deleteDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('delete http://localhost:3000/api/deliveryNote/:id error: id incorrecto', async () => {
    const num = 38
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${deliveryNote._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('delete http://localhost:3000/api/deliveryNote/:id error: albaran firmado firmado', async () => {
    const num = 40
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    deliveryNote.sign = "firma"
    const updatedDeliveryNote = await deliveryNote.save()
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${updatedDeliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('Albaran firmado, No se puede eliminar');

});
it('delete http://localhost:3000/api/deliveryNote/:id sin errores', async () => {
    const num = 41
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deliveryNote = await createDeliveryNote(user._id, client._id, project._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/deliveryNote/${deliveryNote._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body.message).toBe('Albaran eliminado permanentemente (hard delete)');


});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})
