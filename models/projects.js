const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ProyectsScheme = new mongoose.Schema(
    {   
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        userId:String,
        clientId: mongoose.Schema.Types.ObjectId,
        name:String,
        proyectCode:String,
        code: String,
        email:String,
        projectCode:String
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

ProyectsScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("projects", ProyectsScheme) 