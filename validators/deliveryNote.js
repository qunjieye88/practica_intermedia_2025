const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

const createDeliveryNoteValidator = [
  check('projectId').exists().isMongoId(),
  check('userId').exists().isMongoId(),
  check('clientId').exists().isMongoId(),
  check('items').exists().isArray({ min: 1 }).custom((items) => {
    for (const item of items) {
      if (item.type === 'hour') {
        if (typeof item.hours !== 'number') {
          throw new Error('Cada item de tipo "hour" debe tener el campo "hours" como número');
        }
      } else if (item.type === 'material') {
        if (typeof item.quantity !== 'number') {
          throw new Error('Cada item de tipo "material" debe tener el campo "quantity" como número');
        }
      } else {
        throw new Error(`Tipo de item no reconocido: ${item.type}`);
      }
    }
    return true;
  }),
  (req, res, next) => {
    return validateResults(req, res, next)
  }
]

module.exports = { createDeliveryNoteValidator }