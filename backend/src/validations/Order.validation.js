/**
 * Validações de Pedido
 * Define as regras de validação para operações relacionadas a pedidos
 */

const { body } = require("express-validator");

class OrderValidation {
  /**
   * Validações para criação de pedido
   * Verifica se o usuário é válido e se há itens no pedido
   */
  static CreateOrder = [
    body("user").isMongoId().notEmpty().withMessage("Usuário é obrigatório"),
    body("items").isArray().notEmpty().withMessage("Item é obrigatório"),
  ];
}

module.exports = OrderValidation;
