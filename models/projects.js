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
        userId:mongoose.Schema.Types.ObjectId,
        clientId: mongoose.Schema.Types.ObjectId,
        name:String,
        code: String,
        email:String,
        projectCode:{
            type: String,
            unique: true,
            index: true
        },
        notes:String
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

ProyectsScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("Project", ProyectsScheme) 