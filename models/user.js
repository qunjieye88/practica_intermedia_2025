const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const UserScheme = new mongoose.Schema(
    {   
        url:String,
        filename: {
            type: String
        },
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
            enum: ["user", "admin","guest"],
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

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("User", UserScheme) 