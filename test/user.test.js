const objeto = require("../utils/handleEmail.js");
const spy = jest.spyOn(objeto, "sendEmail").mockImplementation()
const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const { tokenSign } = require("../utils/handleJwt.js");
const { createUser } = require("../utils/create.js")

const api = supertest(app);

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

//post http://localhost:3000/api/user/register
it('post http://localhost:3000/api/user/register error: correo ya registrado', async () => {
    const num = 0;
    const user = await createUser(num)
    const response = await api
        .post('/api/user/register')
        .send({
            email: user.email,
            password: "createUser"
        })
        .expect(409)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("El correo ya está registrado");
});

it('post http://localhost:3000/api/user/register error: campos insuficientes', async () => {
    const response = await api
        .post('/api/user/register')
        .send({ email: "marcos@correo.es" })
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/user/register usuario registrado sin errores', async () => {
    const response = await api
        .post('/api/user/register')
        .send({
            email: "marcos@correo.es",
            password: "createUser"
        })
        .expect(201)
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(spy).toHaveBeenCalled();
});

//put http://localhost:3000/api/user/validation

it('put http://localhost:3000/api/user/validation error: codigo incorrecto', async () => {
    const num = 1;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 999998 })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Usuario No Existe/Codigo incorrecto");
});

it('put http://localhost:3000/api/user/validation error: codigo incorrecto', async () => {
    const num = 2;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: 999998 })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Usuario No Existe/Codigo incorrecto");
});


it('put http://localhost:3000/api/user/validation error: sin token', async () => {
    const num = 3;
    const user = await createUser(num)
    const emailCode = user.emailCode
    const response = await api
        .put('/api/user/validation')
        .send({ code: emailCode })
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/user/validation error: token incorrecto', async () => {
    const num = 4;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const emailCode = user.emailCode
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}s`)
        .send({ code: emailCode })
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('put http://localhost:3000/api/user/validation error: faltan parametros', async () => {
    const num = 5;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('put http://localhost:3000/api/user/validation sin errores', async () => {
    const num = 6;
    const user = await createUser(num)
    const emailCode = user.emailCode
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${token}`)
        .send({ code: emailCode })
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body.user.status).toBe(1);
});

//post http://localhost:3000/api/user/login
it('post http://localhost:3000/api/user/login error: contraseña mal escrita', async () => {
    const num = 7;
    const user = await createUser(num)
    const response = await api
        .post('/api/user/login')
        .send({
            email: user.email,
            password: "malsdasda"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Contraseña incorrecta");
});

it('post http://localhost:3000/api/user/login error: usuario sin validar', async () => {
    const num = 8;
    const user = await createUser(num)
    user.status = 0;
    const userUpdated = await user.save();
    const response = await api
        .post('/api/user/login')
        .send({
            email: userUpdated.email,
            password: "12345678"
        })
        .expect(400)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Usuario sin validar");
});
it('post http://localhost:3000/api/user/login error: correo no existente', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
            email: "a@gmail.com",
            password: "malsdasda"
        })
        .expect(404)
        .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe("Usuario No Encontrado");
});
it('post http://localhost:3000/api/user/login login faltan datos', async () => {
    const response = await api
        .post('/api/user/login')
        .send({
        })
        .expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('post http://localhost:3000/api/user/login sin errores', async () => {
    const num = 9;
    const user = await createUser(num)
    const response = await api
        .post('/api/user/login')
        .send({
            email: user.email,
            password: "12345678"
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
});

//put http://localhost:3000/api/user/register
it('put http://localhost:3000/api/user/register error: falta token', async () => {

    const num = 10;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/register')
        .send({
            name: "qunjieye",
            nif: "40000000Q",
            role: "admin"
        })
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('put http://localhost:3000/api/user/register error: token mal escrito', async () => {

    const num = 11;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .put('/api/user/register')
        .set('Authorization', `Bearer ${token}s`)
        .send({
            name: "qunjieye",
            nif: "40000000Q",
            role: "admin"
        })
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('put http://localhost:3000/api/user/register sin errores', async () => {

    const num = 12;
    const user = await createUser(num)
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
        .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveProperty('user');
});

//patch http://localhost:3000/api/user/company 
it('patch http://localhost:3000/api/user/company error: falta token', async () => {

    const num = 13;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
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
        .expect(401)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe('NO TOKEN');
});

it('patch http://localhost:3000/api/user/company error: token mal escrito', async () => {

    const num = 14;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}s`)
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
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/user/company error: token mal escrito', async () => {

    const num = 15;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}s`)
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
        .expect(403)
        .expect('Content-Type', /application\/json/);
    expect(response.body.error).toBe("Error de autenticacion");
});

it('patch http://localhost:3000/api/user/company error: campos incorrectos', async () => {

    const num = 16;
    const user = await createUser(num)
    const token = await tokenSign({ _id: user._id, role: user.role })
    const response = await api
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${token}s`)
        .send({
            company: {
                province: "Madrid",
                name: "qunjieyse",
                cif: "40000010Q"
            }
        }).expect(422)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('errors');
});

it('patch http://localhost:3000/api/user/company sin errores (con todos los datos)', async () => {

    const num = 17;
    const user = await createUser(num)
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
        }).expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('user');
});


it('patch http://localhost:3000/api/user/company sin errores (sin nombre ni cif)', async () => {

    const num = 18;
    const user = await createUser(num)
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
            }
        }).expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveProperty('user');
});
afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})