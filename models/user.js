const mongoose = require("mongoose")

const UserScheme = new mongoose.Schema(
    {   
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        company: {
            name: String,
            cif: String,
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        email: {
            type: String,
            unique: true
        },
        emailCode:{
            type: Number
        },
        status:{
            type: Number,
            enum: [0, 1],
            default: 0
        },
        role: {
            type:String,
            enum: ["user", "admin"],
            default: "user"
        },
        name: {
            type: String
        },
        nif:{
            type:String
        },
        surnames:{
            type:String
        },
        password: {
            type: String // TODO Guardaremos el hash
        }
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)
module.exports = mongoose.model("users", UserScheme) 