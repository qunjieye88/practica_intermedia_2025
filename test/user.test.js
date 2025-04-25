const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const { encrypt } = require("../utils/handlePassword")
const { tokenSign } = require("../utils/handleJwt.js")
const api = supertest(app);

const createUser = {
    email: "marcos@correo.es",
    password: "createUser"
}

let users;

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    users = [
        {//0
            email: "0@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//1
        {
            email: "1@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 0,
            role: "user"
        },//2
        {
            email: "2@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 0,
            role: "user"
        },//3
        {
            email: "3@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 0,
            role: "user"
        },//4
        {
            email: "4@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//5
        {
            email: "5@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//6
        {
            email: "6@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 0,
            role: "user"
        },//7
        {
            email: "7@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//8
        {
            email: "8@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//9
        {
            email: "9@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//10
        {
            email: "10@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//11
        {
            name: "qunjieye",
            nif: "40000000Q",
            email: "11@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//12
        {
            email: "12@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//13
        {
            name: "qunjieye",
            nif: "40000000Q",
            email: "13@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        },//14
        {
            name: "qunjieye",
            nif: "40000000Q",
            email: "14@correo.es",
            password: await encrypt("12345678"),
            emailCode: 999999,
            status: 1,
            role: "user"
        }
    ];
    await UserModel.insertMany(users);
});

it('post http://localhost:3000/api/user/register registrar usuario sin datos suficientes', async () => {
    const response = await api
        .post('/api/user/register')
        .send({ email: createUser.email })
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/user/register usuario registrado sin errores', async () => {
    const response = await api
        .post('/api/user/register')
        .send(createUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
});

//0
it('post http://localhost:3000/api/user/validation validar token usuario ya validado', async () => {
    const response = await api
        .post('/api/user/register')
        .send({ email: users[0].email, password: "12345678" })
        .expect(409)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});

//1
it('put http://localhost:3000/api/user/validation sin token', async () => {
    const user = await UserModel.findOne(users[1])
    const emailCode = user.emailCode
    const response = await api
        .put('/api/user/validation')
        .send({ code: emailCode })
        .expect(401)
        .expect('Content-Type', /text\/html/)

    expect(response.text).toBe('NO TOKEN');
});
//2
it('put http://localhost:3000/api/user/validation sin emailCode', async () => {
    const user = await UserModel.findOne(users[2])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

//3
it('put http://localhost:3000/api/user/validation sin errores', async () => {
    const user = await UserModel.findOne(users[3])
    const emailCode = user.emailCode
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: emailCode })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.message.status).toBe(1);
});
//4
it('post http://localhost:3000/api/user/login login con contraseña mal', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
            email: users[4].email,
            password: "malsdasda"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});
//5
it('post http://localhost:3000/api/user/login login faltan datos', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
            email: users[5].email
        })
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});
//6
it('post http://localhost:3000/api/user/login login del usuario sin validar', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
            email: users[6].email,
            password: "12345678"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});

//7
it('post http://localhost:3000/api/user/login sin errores', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
            email: users[7].email,
            password: "12345678"
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
});

//8
it('post http://localhost:3000/api/user/register correo ya existente', async () => {

    const user = await UserModel.findOne(users[8])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
            email: users[7].email,
            name: "qunjieye",
            nif: "40000000Q",
            role: "admin"
        })
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});
//9
it('post http://localhost:3000/api/user/register update usuario sin token', async () => {

    const user = await UserModel.findOne(users[9])
    const response = await api
        .put('/api/user/register')
        .send({
            name: "qunjieye",
            nif: "40000000Q",
            role: "admin"
        })
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});
//10
it('post http://localhost:3000/api/user/register update usuario sin errores', async () => {

    const user = await UserModel.findOne(users[10])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: "qunjieye",
            nif: "40000000Q",
            role: "admin"
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
});
//11
it('patch http://localhost:3000/api/user/company añadir compania sin errores sin nombre ni cif', async () => {

    const user = await UserModel.findOne(users[11])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}`)
        .send({
            company: {
                street: "Carlos 67",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('company');
});
//12
it('patch http://localhost:3000/api/user/company añadir compania con error, sin nombre de usuario ni nombre de compania', async () => {

    const user = await UserModel.findOne(users[12])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}`)
        .send({
            company: {
                street: "Carlos 67",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('message');
});

//13
it('patch http://localhost:3000/api/user/company añadir compania con error, sin token', async () => {

    const user = await UserModel.findOne(users[13])
    const response = await api
        .patch('/api/user/company')
        .send({
            company: {
                street: "Carlos 67",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid"
            }
        })
        .expect(401)
        .expect('Content-Type', /text\/html/)
    expect(response.text).toBe('NO TOKEN');
});
//14
it('patch http://localhost:3000/api/user/company añadir compania sin errores', async () => {

    const user = await UserModel.findOne(users[14])
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}`)
        .send({
            company: {
                street: "Carlos 67",
                number: 22,
                postal: 28936,
                city: "Móstoles",
                province: "Madrid",
                name: "qunjieyse",
                cif: "40000010Q"
            }
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('company');
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})
