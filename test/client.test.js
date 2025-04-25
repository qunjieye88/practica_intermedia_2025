const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const ClientModel = require("../models/client.js");
const { encrypt, compare, hola } = require("../utils/handlePassword")
const { tokenSign, verifyToken } = require("../utils/handleJwt.js")
const api = supertest(app);
const { ObjectId } = require('mongodb');

let users;
let clients;
let clientsId;
let usersId;
beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    await ClientModel.deleteMany({})

    usersId = [
        new ObjectId(),//0
        new ObjectId(),//1
        new ObjectId(),//2
        new ObjectId(),//3
        new ObjectId(),//4
        new ObjectId(),//5
        new ObjectId(),//6
        new ObjectId(),//7
        new ObjectId(),//8
        new ObjectId(),//9
        new ObjectId(),//10
        new ObjectId(),//11
        new ObjectId(),//12
        new ObjectId(),//13
        new ObjectId(),//14
        new ObjectId(),//15
    ]

    clientsId = [
        new ObjectId(),//0
        new ObjectId(),//1
        new ObjectId(),//2
        new ObjectId(),//3
        new ObjectId(),//4
        new ObjectId(),//5
        new ObjectId(),//6
        new ObjectId(),//7
        new ObjectId(),//8
        new ObjectId(),//9
        new ObjectId(),//10
        new ObjectId(),//11
        new ObjectId(),//12
        new ObjectId(),//13
        new ObjectId(),//14
        new ObjectId(),//15
    ]

    users = [
        {//0
            name: "0",
            nif: "40000000Q",
            email: "0@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },
        {//1
            name: "1",
            nif: "40000000Q",
            email: "1@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[1]
        },
        {//2
            name: "2",
            nif: "40000000Q",
            email: "2@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin"
        },
        {//3
            name: "3",
            nif: "40000000Q",
            email: "3@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin"
        },
        {//4
            name: "4",
            nif: "40000000Q",
            email: "4@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin"
        },
        {//5
            name: "5",
            nif: "40000000Q",
            email: "5@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin"
        },
        {//6
            name: "6",
            nif: "40000000Q",
            email: "6@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[6]
        },
        {//7
            name: "7",
            nif: "40000000Q",
            email: "7@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[7]
        },
        {//8
            name: "8",
            nif: "40000000Q",
            email: "8@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[8]
        },
        {//9
            name: "9",
            nif: "40000000Q",
            email: "9@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[9]
        },
        {//10
            name: "10",
            nif: "40000000Q",
            email: "10@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[10]
        },
        {//11
            name: "11",
            nif: "40000000Q",
            email: "11@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[11]
        },
        {//12
            name: "12",
            nif: "40000000Q",
            email: "12@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[12]
        },
        {//13
            name: "13",
            nif: "40000000Q",
            email: "13@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[13]
        },
        {//14
            name: "14",
            nif: "40000000Q",
            email: "14@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[14]
        },
        {//15
            name: "15",
            nif: "40000000Q",
            email: "15@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "admin",
            _id: usersId[15]
        }
    ];

    clients = [
        {//0
            name: "0",
            cif: "S00000000",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        },
        {//1
            name: "1",
            cif: "S00000001",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[1]
        },
        {//2
            name: "2",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
        },
        {//3
            name: "3",
            cif: "S00000003",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        },
        {//4
            name: "4",
            cif: "S00000004",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        },
        {//5
            name: "5",
            cif: "S00000005",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        },
        {//6
            name: "6",
            cif: "S00000006",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[6]
        },
        {//7
            name: "7",
            cif: "S00000007",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[7]
        },
        {//8
            name: "8",
            cif: "S00000008",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[8]
        },
        {//9
            name: "9",
            cif: "S00000009",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[9]
        },
        {//10
            name: "10",
            cif: "S00000010",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[10]
        },
        {//11
            name: "11",
            cif: "S00000011",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[11]
        },
        {//12
            name: "12",
            cif: "S00000012",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[12],
            deleted: true,
            _id: clientsId[12]
        },
        {//13
            name: "13",
            cif: "S00000013",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[13],
            deleted: true,
            _id: clientsId[13]
        },
        {//14
            name: "14",
            cif: "S00000014",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[14],
            deleted: true,
            _id: clientsId[14]
        },
        {//15
            name: "15",
            cif: "S00000015",
            address: {
                street: "Carlos V",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            },
            userId: usersId[15],
            deleted: true,
            _id: clientsId[15]
        }
    ]
    console.log(clientsId[15])

    await UserModel.insertMany(users);
    await ClientModel.insertMany(clients);
});
//post http://localhost:3000/api/client

it('post http://localhost:3000/api/client registrar cliente sin permisos administrador', async () => {
    const numArray = 0
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send(clients[numArray])
        .expect(403)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('error');
});

it('post http://localhost:3000/api/client registrar cliente ya asociado a usuario', async () => {
    const numArray = 1
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send(clients[numArray])
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});

it('post http://localhost:3000/api/client registrar cliente sin datos suficientes', async () => {
    const numArray = 2
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send(clients[numArray])
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});


it('post http://localhost:3000/api/client registrar cliente sin errores', async () => {
    const numArray = 3
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .set('Authorization', `Bearer ${token}`)
        .send(clients[numArray])
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

it('post http://localhost:3000/api/client registrar cliente sin token', async () => {
    const numArray = 4
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .post('/api/client')
        .send(clients[numArray])
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

//put http://localhost:3000/api/client/:id
it('put http://localhost:3000/api/client/:id actualizarCliente sin token', async () => {
    const numArray = 5
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
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
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/client/:id actualizar Cliente no asociado a Usuario', async () => {
    const numArray = 6
    const user = await UserModel.findOne(users[numArray - 1])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    console.log(`/api/client/${client._id}`)
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
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});


it('put http://localhost:3000/api/client/:id actualizar Cliente sin errores', async () => {
    const numArray = 7
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
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
        .expect('Content-Type', /application\/json/)
});

//get http://localhost:3000/api/client
it('get http://localhost:3000/api/client obtener cliente sin errores', async () => {
    const numArray = 8
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

//get http://localhost:3000/api/client/:id
it('get http://localhost:3000/api/client/:id obtener cliente sin errores', async () => {
    const numArray = 9
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .get(`/api/client/${client._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

//delete http://localhost:3000/api/client/:id?soft=true
it('delete http://localhost:3000/api/client/:id eliminar con soft delete', async () => {
    const numArray = 10
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=true`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.client.deleted).toBe(true);
});

it('delete http://localhost:3000/api/client/:id eliminar con hard delete', async () => {
    const numArray = 11
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${client._id}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente eliminado permanentemente (hard delete)");
});

it('delete http://localhost:3000/api/client/:id eliminar con hard delete pero ya no existe', async () => {
    const numArray = 12
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${clientsId[numArray]}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Cliente No Existe");
});

it('delete http://localhost:3000/api/client/:id eliminar con soft delete pero ya no existe', async () => {
    const numArray = 13
    const user = await UserModel.findOne(users[numArray])
    const client = await ClientModel.findOne(clients[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .delete(`/api/client/${clientsId[numArray]}?soft=false`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("El Cliente No Existe");
});

//patch http://localhost:3000/api/client/¡:id

it('patch http://localhost:3000/api/client/:id recuperar cliente que no existe', async () => {
    const numArray = 14
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${new ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente no encontrado o ya activo");
});

it('patch http://localhost:3000/api/client/:id recuperar cliente sin errores', async () => {
    const numArray = 15
    const user = await UserModel.findOne(users[numArray])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch(`/api/client/${clientsId[numArray]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message).toBe("Cliente restaurado correctamente");
});