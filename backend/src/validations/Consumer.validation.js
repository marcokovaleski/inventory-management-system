const { body, param, query } = require("express-validator");
class ConsumerValidation {
  static RegisterConsumer = [
    body("name").notEmpty().withMessage("Nome não pode ser vazio"),
    body("email")
      .isEmail()
      .withMessage("E-mail deve ser válido")
      .notEmpty()
      .withMessage("E-mail não pode ser vazio"),
    body("mobile").notEmpty().withMessage("Celular não pode ser vazio"),
    body("dob").notEmpty().withMessage("Data de nascimento não pode ser vazia"),
    body("address").notEmpty().withMessage("Endereço não pode ser vazio"),
  ];

  static Params_id = [
    param("id")
      .isMongoId()
      .withMessage("Forneça um ID válido")
      .notEmpty()
      .withMessage("ID é obrigatório"),
  ];

  static query_page = [query("page").optional(), query("query").optional()];
}

module.exports = ConsumerValidation;
