const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")
const { body } = require("express-validator");

const entryValidator = body("entries").isArray({ min: 1 }).notEmpty().custom((entries) => {
  for (const entry of entries) {
    if (!entry.format || !["material", "hours"].includes(entry.format)) {
      throw new Error("El formato debe ser 'material' o 'hours'");
    }
    if (entry.format === "hours") {
      if (typeof entry.hours !== "number" || entry.hours <= 0) {
        throw new Error("Debe especificar un número válido de horas");
      }
    }
    if (entry.format === "material") {
      if (!entry.material || typeof entry.material !== "string") {
        throw new Error("Debe especificar el tipo de material");
      }
    }
    if (!entry.description || typeof entry.description !== "string") {
      throw new Error("Debe incluir una descripción válida");
    }
    if (!entry.workdate || isNaN(Date.parse(entry.workdate))) {
      throw new Error("Debe proporcionar una fecha válida (workdate)");
    }
  }
  return true;
});

const createDeliveryNoteValidator = [
  body("clientId").notEmpty().notEmpty(),
  body("projectId").notEmpty().notEmpty(),
  entryValidator
];



module.exports = {createDeliveryNoteValidator}