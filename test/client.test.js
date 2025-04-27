const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const { tokenSign } = require("../utils/handleJwt.js")
const { createClient, createUser} = require("../utils/create.js")

const api = supertest(app);

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    await ClientModel.deleteMany({})
    await UserModel.deleteMany({})
});

//post http://localhost:3000/api/client

it('post http://localhost:3000/api/client error: cliente pertenece al usuario', async () => {
    const num = 0;
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: client.name,
            cif: client.cif,
            address: client.address
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("El Cliente Pertenece Al Usuario");
});
it('post http://localhost:3000/api/client error: falta token', async () => {
    const num = 1;
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .post('/api/client')
        .send({
            name: `${num}`,
            cif: `S0000000${num}`,
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});
it('post http://localhost:3000/api/client error: token mal escrito', async () => {
    const num = 2;
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}s`)
        .send({
            name: `${num}`,
            cif: `S0000000${num}`,
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(403)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error');
});

it('post http://localhost:3000/api/client error: sin permisos', async () => {
    const num = 3;
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: `${num}`,
            cif: `S0000000${num}`,
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('post http://localhost:3000/api/client error: campos incorrectos', async () => {
    const num = 4;
    const user = await createUser(num)
    const userUpdated = await user.save();
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: `${num}`,
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/client sin errores', async () => {
    const num = 5;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: `${num}`,
            cif: `S0000000${num}`,
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('client');
});

//put http://localhost:3000/api/client/:id
it('put http://localhost:3000/api/client/:id error: falta token', async () => {
    const num = 6;
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/client/:id error: token mal escrito', async () => {
    const num = 7;
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('put http://localhost:3000/api/client/:id error: sin permisos', async () => {
    const num = 8;
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('put http://localhost:3000/api/client/:id error: id incorrecto', async () => {
    const num = 9;
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});

it('put http://localhost:3000/api/client/:id error: cliente no asociado a usuario', async () => {
    const num = 10;
    const user = await createUser(num)
    const userAux = await createUser(-99999 + num)
    const client = await createClient(num, userAux._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");
});

it('put http://localhost:3000/api/client/:id sin errores', async () => {
    const num = 11;
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            address: {
                street: "Carlos VI",
                number: 23,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('client');
});

//get http://localhost:3000/api/client

it('get http://localhost:3000/api/client error: falta token', async () => {
    const num = 12
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/client error: token mal escrito', async () => {
    const num = 13
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});
it('get http://localhost:3000/api/client sin errores', async () => {
    const num = 14
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('clients');
});


//get http://localhost:3000/api/client/:id

it('get http://localhost:3000/api/client/:id error: cliente no pertenece usuario', async () => {
    const num = 15
    const user = await createUser(num)
    const userAux = await createUser(-99999 + num)
    const client = await createClient(num, userAux._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");
});

it('get http://localhost:3000/api/client/:id error: id invalido', async () => {
    const num = 16
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}s`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});


it('get http://localhost:3000/api/client/:id error: falta token', async () => {
    const num = 17
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('get http://localhost:3000/api/client/:id error: token mal escrito', async () => {
    const num = 18
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('get http://localhost:3000/api/client/:id error: sin permisos', async () => {
    const num = 19
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('get http://localhost:3000/api/client/:id sin errores', async () => {
    const num = 20
    const user = await createUser(num)
    const userUpdated = await user.save();
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('client');
});

//delete http://localhost:3000/api/client/:id?soft=true

it('delete http://localhost:3000/api/client/:id error: cliente no pertenece a usuario', async () => {
    const num = 21
    const user = await createUser(num)
    const userAux = await createUser(-99999 + num)
    const client = await createClient(num, userAux._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El Cliente No Pertenece Al Usuario");
});

it('delete http://localhost:3000/api/client/:id error: id invalido', async () => {
    const num = 22
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}s?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ID inválido");
});


it('delete http://localhost:3000/api/client/:id error: falta token', async () => {
    const num = 23
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('delete http://localhost:3000/api/client/:id error: token mal escrito', async () => {
    const num = 24
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('delete http://localhost:3000/api/client/:id error: sin permisos', async () => {
    const num = 25
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("ERROR PERMISO");
});

it('delete http://localhost:3000/api/client/:id error: no existe', async () => {
    const num = 26
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const deletedClient = await ClientModel.findByIdAndDelete(client._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${deletedClient._id}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Cliente No Encontrado");
});

it('delete http://localhost:3000/api/client/:id sin error (soft)', async () => {
    const num = 27
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe('Cliente eliminado (soft delete)');
});
it('delete http://localhost:3000/api/client/:id sin error (hard)', async () => {
    const num = 28
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe('Cliente eliminado permanentemente (hard delete)' );
});


//patch http://localhost:3000/api/client/:id

it('patch http://localhost:3000/api/client/:id error: falta token', async () => {
    const num = 29
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${client._id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('patch http://localhost:3000/api/client/:id error: token mal escrito', async () => {
    const num = 30
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/client/:id error: sin permisos', async () => {
    const num = 31
    const user = await createUser(num)
    user.role = "user"
    const userUpdated = await user.save();
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: userUpdated._id, role: userUpdated.role })
    const response = await api
        .patch(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}s`)
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/client/:id error: id incorrecto', async () => {
    const num = 32
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const deletedClient = await ClientModel.findByIdAndDelete(client._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${deletedClient._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Cliente no encontrado o ya activo");
});

it('patch http://localhost:3000/api/client/:id sin errores', async () => {
    const num = 33
    const user = await createUser(num)
    const client = await createClient(num, user._id)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente restaurado correctamente" );
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})