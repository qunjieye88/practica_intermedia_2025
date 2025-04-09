const mongoose = require('mongoose')

process.env.DB_URI_TEST
const dbConnect = () => {
    const db_uri = process.env.DB_URI
    mongoose.set('strictQuery', false)
    try {
        mongoose.connect(db_uri)
        console.log("Base de datos conectada")
    } catch (error) {
        console.err("Error conectando a la BD:", error)
    }
    mongoose.connection.on("connected", () => console.log("Conectado a la BD"))
}
module.exports = dbConnect

/*
const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI:

process.env.DB_URI_TEST
const dbConnect = () => {
mongoose.set('strictQuery', false)
mongoose.connect(db_uri)
}*/