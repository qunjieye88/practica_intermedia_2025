const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const entrySchema = new Schema({
    format: {
      type: String,
      enum: ["material", "hours"],
      required: true,
    },
    material: String,
    hours: Number,
    description: String,
    workdate: Date,
  });
  
  const deliveryNoteSchema = new Schema(
    {
      clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
      projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
      entries: [entrySchema],
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

DeliveryNoteScheme.plugin(mongooseDelete, { overrideMethods: "all" })
module.exports = mongoose.model("DeliveryNote", DeliveryNoteScheme) 