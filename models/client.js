const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const ClientScheme = new mongoose.Schema(
    {   
        address: {
            street: String,
            number: Number,
            postal: Number,
            city: String,
            province: String
        },
        name: {
            type: String
        },
        cif:{
            type:String
        },
        logo:{
            type:String
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true, // TODO createdAt, updatedAt
        versionKey: false
    }
)

ClientScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("client", ClientScheme) 