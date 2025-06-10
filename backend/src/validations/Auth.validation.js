const { body } = require("express-validator");
class AuthValidation {
  static RegisterUser = [
    body("token").notEmpty().withMessage("Token do captcha é obrigatório"),
    body("name").notEmpty().withMessage("Nome não pode ser vazio"),
    body("email")
      .isEmail()
      .withMessage("E-mail deve ser válido")
      .notEmpty()
      .withMessage("E-mail não pode ser vazio"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter no mínimo 6 caracteres")
      .notEmpty()
      .withMessage("Senha é obrigatória"),
  ];
  static LoginUser = [
    body("token").notEmpty().withMessage("Token do captcha é obrigatório"),
    body("email")
      .isEmail()
      .withMessage("E-mail deve ser válido")
      .notEmpty()
      .withMessage("E-mail é obrigatório"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter no mínimo 6 caracteres")
      .notEmpty()
      .withMessage("Senha é obrigatória"),
  ];
}

module.exports = AuthValidation;
