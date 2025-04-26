const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const { encrypt, compare, hola } = require("../utils/handlePassword")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const api = supertest(app);
const { ObjectId } = require('mongodb');
const { createClient, createUser, createProject } = require("../utils/create.js")

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    await UserModel.deleteMany({})
    await ClientModel.deleteMany({})
    await ProjectModel.deleteMany({})
})
//post http://localhost:3000/api/project
it('post http://localhost:3000/api/project error cliente no asociado a usuario', async () => {
    const num = 0
    const user = await createUser(num, null);
    const userAux = await createUser(-99999 + num, null);
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const data = {
        name: "Nombre del proyecto",
        projectCode: "Identificador de proyecto",
        email: "miemail@gmail.com",
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: "Código interno del proyecto",
        clientId: client._id.toString()
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente no pertenece al usuario");
});

it('post http://localhost:3000/api/project no hay token', async () => {
    const num = 1
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: "Nombre del proyecto",
        projectCode: "Identificador de proyecto",
        email: "miemail@gmail.com",
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: "Código interno del proyecto",
        clientId: client._id.toString()
    }
    const response = await api
        .post('/api/project')
        .send(data)
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('post http://localhost:3000/api/project error autentificacion de token', async () => {
    const num = 2
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: "Nombre del proyecto",
        projectCode: "Identificador de proyecto",
        email: "miemail@gmail.com",
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: "Código interno del proyecto",
        clientId: client._id
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}s`)
        .send(data)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});

it('post http://localhost:3000/api/project crear proyecto ya creado', async () => {
    const num = 3
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: `${num}`,
        projectCode: project.projectCode,
        email: `${num}@correo.es`,
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: `${num}`,
        clientId: client._id,
        userId: user._id
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Proyecto Creado");
});

it('post http://localhost:3000/api/project error faltan datos', async () => {
    const num = 4
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: "Nombre del proyecto",
        email: "miemail@gmail.com",
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: "Código interno del proyecto",
        clientId: client._id.toString()
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/project crear proyecto sin errores', async () => {
    const num = 5
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: "Nombre del proyecto",
        projectCode: "Identificador de proyecto",
        email: "miemail@gmail.com",
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        },
        code: "Código interno del proyecto",
        clientId: client._id.toString()
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

//put http://localhost:3000/api/project/:id

it('put http://localhost:3000/api/project error: cliente no asociado a usuario', async () => {
    const num = 6
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const userAux = await createUser(-99999 + num, null);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const data = {
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        }
    }
    const response = await api
        .put(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Proyecto No Existe/No pertenece al usuaro");

});

it('put http://localhost:3000/api/project error: no hay token', async () => {
    const num = 7
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        }
    }
    const response = await api
        .put(`/api/project/${project._id}`)
        .send(data)
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/project error: token mal escrito', async () => {
    const num = 8
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        }
    }
    const response = await api
        .put(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .send(data)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});

it('put http://localhost:3000/api/project error: cliente id incorrecto', async () => {
    const num = 9
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        }
    }
    const response = await api
        .put(`/api/project/${project._id}8`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/)
});

it('put http://localhost:3000/api/project sin errores', async () => {
    const num = 10
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        address: {
            "street": "Carlos V",
            "number": 22,
            "postal": 28936,
            "city": "Móstoles",
            "province": "Madrid"
        }
    }
    const response = await api
        .put(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

//get http://localhost:3000/api/client

it('put http://localhost:3000/api/project error: sin token', async () => {
    const num = 11
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/project error: autentificacion del token', async () => {
    const num = 12
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});


it('put http://localhost:3000/api/project sin errores', async () => {
    const num = 13
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});
//get http://localhost:3000/api/project/:id

it('put http://localhost:3000/api/project error: proyecto no pertenece al usuario', async () => {
    const num = 14
    const user = await createUser(num, null);
    const userAux = await createUser(-99999 + num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Proyecto No Existe/No pertenece al usuaro");
});

it('put http://localhost:3000/api/project error: no hay token', async () => {
    const num = 15
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/project error: autentificacion', async () => {
    const num = 16
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});

it('put http://localhost:3000/api/project error: id incorrecto', async () => {
    const num = 17
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}5`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
});


it('put http://localhost:3000/api/project sin errores', async () => {
    const num = 18
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

// delete http://localhost:3000/api/project/6809169a80c0972a28f8592a?soft=false

it('delete http://localhost:3000/api/project error: proyecto no pertenece a usuario', async () => {
    const num = 19
    const user = await createUser(num, null);
    const userAux = await createUser(-99999 + num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Proyecto No Existe/No pertenece al usuaro");
});

it('delete http://localhost:3000/api/project error: no hay token', async () => {
    const num = 20
    const user = await createUser(num, null);
    const userAux = await createUser(-99999 + num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('delete http://localhost:3000/api/project error: autentificacion token', async () => {
    const num = 21
    const user = await createUser(num, null);
    const userAux = await createUser(-99999 + num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');
});

it('delete http://localhost:3000/api/project error: id mal puesto', async () => {
    const num = 22
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}s?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
});

it('delete http://localhost:3000/api/project error: eliminar proyecto ya eliminado ', async () => {
    const num = 23
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    await project.delete();
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cannot read properties of null (reading 'clientId')");
});


it('delete http://localhost:3000/api/project error: id mal puesto', async () => {
    const num = 24
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}s?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
});

it('delete http://localhost:3000/api/project sin errores soft delete', async () => {
    const num = 25
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    expect(response.body.message).toBe("Cliente eliminado (soft delete)");
});

it('delete http://localhost:3000/api/project sin errores haard delete', async () => {
    const num = 26
    const user = await createUser(num, null);
    const client = await createClient(num, null, user._id);
    const project = await createProject(num, null, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    expect(response.body.message).toBe("Cliente eliminado permanentemente (hard delete)");
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})


/*

        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente no pertenece al usuario");

    
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');


        .expect(403)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('Error de autenticacion');

    ¡
        .expect(400)
        .expect('Content-Type', /application\/json/)

    
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
*/