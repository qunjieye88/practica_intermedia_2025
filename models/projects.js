const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ProjectsScheme = new mongoose.Schema(
    {   
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        userId:String,
        clientId: String,
        name:String,
        proyectCode:String,
        code: String,
        email:String
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("projects", ProjectssScheme) 