const supertest = require('supertest')
const { app, server } = require('../app.js')
const mongoose = require('mongoose');
const UserModel = require("../models/user.js");
const { encrypt, compare, hola } = require("../utils/handlePassword")

const { tokenSign, verifyToken } = require("../utils/handleJwt.js")

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

    users = [//0
        {
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
        .expect('Content-Type', /application\/json/); +
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




/*
it('should validate a user', async () => {
    //const spy = jest.spyOn(Password, 'encrypt');
    const createUser = {
        email: "marcos@correo.es",
        password: "mipassword"
    }
    const response = await api.post('/api/user/register')
        .send(createUser[0])
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
})*/

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