const { body } = require("express-validator");
class OrderValidation {
  static CreateOrder = [
    body("user").isMongoId().notEmpty().withMessage("Usuário é obrigatório"),
    body("items").isArray().notEmpty().withMessage("Item é obrigatório"),
  ];
}

module.exports = OrderValidation;
