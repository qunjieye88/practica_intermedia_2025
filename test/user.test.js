const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");

const findUserEmail = requite("../utils/handleUser.js")

const api = supertest(app);

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));

    await api.delete('/api/user/deleteAllUsers')
        .expect(200)
        .expect('Content-Type', /application\/json/)


});





it('should register a user', async () => {
    //const spy = jest.spyOn(pass, 'encrypt');
    const initialUsers = {
        email: "marcos@correo.es",
        password: "mipassword"
    }
    const response = await api.post('/api/user/register')
        .send(initialUsers)
        .expect(201)
        .expect('Content-Type', /application\/json/); +
            expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    //expect(spy).toHaveBeenCalled();
    //spy.mockRestore();
});


it('should validate a user', async () => {
    //const spy = jest.spyOn(Password, 'encrypt');
    const initialUsers = {
        email: "marcos@correo.es",
        password: "mipassword"
    }
    const response = await api.post('/api/user/register')
        .send(initialUsers[0])
        .expect(201)
        .expect('Content-Type', /application\/json/); +
            expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    //expect(spy).toHaveBeenCalled();
    //spy.mockRestore();
});

afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})

/*
let token
beforeAll(async () => {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    //await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await UserModel.deleteMany({})
    const password = await encrypt(initialUsers[0].password)
    const body = initialUsers[0]
    body.password = password
    const userData = await UserModel.create(body)
    userData.set("password", undefined, { strict: false })
    token = await tokenSign(userData, process.env.JWT_SECRET)
    console.log(token)
});

it('should get all users', async () => {
    await api.get('/api/user/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
afterAll(async () => {
    server.close()
    await mongoose.connection.close();
})*/