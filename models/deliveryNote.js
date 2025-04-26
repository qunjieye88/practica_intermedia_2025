const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const DeliveryNoteScheme = new mongoose.Schema(
  {
    clientId: { type: mongoose.Types.ObjectId, ref: "Client", required: true },
    projectId: { type: mongoose.Types.ObjectId, ref: "Project", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        type: { type: String, enum: ['hour', 'material'], required: true },
        description: String,
        quantity: Number,
        hours: Number
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

DeliveryNoteScheme.plugin(mongooseDelete, { overrideMethods: "all" })
module.exports = mongoose.model("DeliveryNote", DeliveryNoteScheme) 