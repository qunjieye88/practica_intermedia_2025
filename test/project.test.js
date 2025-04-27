const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const ProjectModel = require("../models/projects.js");
const { tokenSign } = require("../utils/handleJwt.js")
const { createClient, createUser, createProject } = require("../utils/create.js")

const api = supertest(app);

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
it('post http://localhost:3000/api/project error: cliente no asociado a usuario', async () => {
    const num = 0
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
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
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");
});
it('post http://localhost:3000/api/project error: falta token', async () => {
    const num = 1
    const user = await createUser(num);
    const client = await createClient(num, user._id);
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
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('post http://localhost:3000/api/project error: token mal escrito', async () => {
    const num = 2
    const user = await createUser(num);
    const client = await createClient(num, user._id);
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
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('post http://localhost:3000/api/project error: proyecto ya creado', async () => {
    const num = 3
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const data = {
        name: project.name,
        projectCode: project.projectCode,
        email: project.email,
        address: project.address,
        code: project.code,
        clientId: project.clientId,
        userId: project.userId
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Proyecto Creado");
});

it('post http://localhost:3000/api/project error: campos incorrectos', async () => {
    const num = 4
    const user = await createUser(num);
    const client = await createClient(num, user._id);
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
        clientId: client._id
    }
    const response = await api
        .post('/api/project')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/project error: sin permisos', async () => {
    const num = 5
    const user = await createUser(num, null);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, null, user._id);
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
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
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('post http://localhost:3000/api/project sin errores', async () => {
    const num = 6
    const user = await createUser(num);
    const client = await createClient(num, user._id);
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
    expect(response.body).toHaveProperty('project');
});

//put http://localhost:3000/api/project/:id

it('put http://localhost:3000/api/project error: proyecto no asociado a usuario', async () => {
    const num = 7
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
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
    expect(response.body.error).toBe("El Proyecto No Pertenece Al Usuario");
});

it('put http://localhost:3000/api/project error: no hay token', async () => {
    const num = 8
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
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
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/project error: token mal escrito', async () => {
    const num = 9
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
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
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('put http://localhost:3000/api/project error: sin permisos', async () => {
    const num = 10
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
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
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});


it('put http://localhost:3000/api/project error: id incorrecto', async () => {
    const num = 11
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
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
        .put(`/api/project/${project._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('put http://localhost:3000/api/project sin errores', async () => {
    const num = 12
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
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

it('get http://localhost:3000/api/project error: falta token', async () => {
    const num = 13
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});


it('get http://localhost:3000/api/project error: token mal escrito', async () => {
    const num = 14
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/project error: sin permisos', async () => {
    const num = 15
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('get http://localhost:3000/api/project error: Sin clientes', async () => {
    const num = 16
    const user = await createUser(num);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Clientes No Encontrados");
});

it('get http://localhost:3000/api/project error: Sin proyectos', async () => {
    const num = 17
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Proyectos No Encontrados");
});

it('get http://localhost:3000/api/project sin errores', async () => {
    const num = 18
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('projects');
});

//get http://localhost:3000/api/project/:id

it('get http://localhost:3000/api/project/:id error: proyecto no pertenece al usuario', async () => {
    const num = 19
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("El Proyecto No Pertenece Al Usuario");
});

it('get http://localhost:3000/api/project/:id error: falta token', async () => {
    const num = 20
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/project/:id error: token mal escrito', async () => {
    const num = 21
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/project/:id error: sin permisos', async () => {
    const num = 22
    const user = await createUser(num);
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, userUpdated._id, userUpdated._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('get http://localhost:3000/api/project/:id error: id incorrecto', async () => {
    const num = 23
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('get http://localhost:3000/api/project/:id sin errores', async () => {
    const num = 24
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('project');
});

// delete http://localhost:3000/api/project/6809169a80c0972a28f8592a?soft=false
it('delete http://localhost:3000/api/project/:id?soft error: proyecto no pertenece a usuario', async () => {
    const num = 25
    const user = await createUser(num);
    const userAux = await createUser(-99999 + num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userAux._id, role: userAux.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("El Proyecto No Pertenece Al Usuario");
});

it('delete http://localhost:3000/api/project/:id?soft error: falta token', async () => {
    const num = 26
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('delete http://localhost:3000/api/project/:id?soft error: token mal escrito', async () => {
    const num = 27
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('delete http://localhost:3000/api/project/:id?soft error: sin permisos', async () => {
    const num = 28
    const user = await createUser(num);    
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('delete http://localhost:3000/api/project/:id?soft error: id Incorrecto', async () => {
    const num = 29
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}s?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('delete http://localhost:3000/api/project/:id?soft error: eliminar proyecto ya eliminado', async () => {
    const num = 30
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const deletedProject = await ProjectModel.findByIdAndDelete(project._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Proyecto No Encontrado");
});

it('delete http://localhost:3000/api/project/:id?soft sin error (soft)', async () => {
    const num = 31
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body.message).toBe('Cliente eliminado (soft delete)');
});
it('delete http://localhost:3000/api/project/:id?soft sin error (hard)', async () => {
    const num = 32
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/project/${project._id}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body.message).toBe('Cliente eliminado permanentemente (hard delete)');
});


//patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b

it('patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b error: no hay token', async () => {
    const num = 33
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    project.delete()
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/project/${project._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b error: id Incorrecto', async () => {
    const num = 34
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    project.delete()
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/project/${project._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});


it('patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b error: token mal escrito', async () => {
    const num = 35
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    project.delete()
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b error: sin permisos', async () => {
    const num = 36
    const user = await createUser(num);    
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    project.delete()
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .patch(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});


it('patch http://localhost:3000/api/project/680cf151c0cb272b1721ac7b sin errores', async () => {
    const num = 38
    const user = await createUser(num);
    const client = await createClient(num, user._id);
    const project = await createProject(num, user._id, client._id);
    project.delete()
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/project/${project._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body.message).toBe("Proyecto restaurado correctamente");
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})