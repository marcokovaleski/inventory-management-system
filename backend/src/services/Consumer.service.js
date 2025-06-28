/**
 * Serviço de Consumidor
 * Gerencia operações relacionadas a consumidores/usuários do sistema
 */

const httpStatus = require("http-status");
const { ConsumerModel, OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");

class ConsumerService {
  /**
   * Registra um novo consumidor no sistema
   * @param {string} user - ID do usuário que está criando o consumidor
   * @param {Object} body - Dados do consumidor (nome, email, telefone, data de nascimento, endereço)
   * @returns {Object} - Mensagem de sucesso
   */
  static async RegisterConsumer(user, body) {
    const { name, email, mobile, dob, address } = body;

    // Verifica se o consumidor já existe
    const checkExist = await ConsumerModel.findOne({
      email: email,
      user: user,
    });

    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Consumidor já cadastrado");
      return;
    }

    // Cria o novo consumidor
    await ConsumerModel.create({
      name,
      email,
      mobile,
      dob,
      address,
      user,
    });

    return {
      msg: "Consumidor adicionado com sucesso",
    };
  }

  /**
   * Exclui um consumidor e seus pedidos relacionados
   * @param {string} user - ID do usuário
   * @param {string} id - ID do consumidor a ser excluído
   * @returns {Object} - Mensagem de sucesso
   */
  static async DeleteConsumer(user, id) {
    const checkExist = await ConsumerModel.findOneAndDelete({
      _id: id,
      user: user,
    });

    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Consumidor não encontrado");
      return;
    }

    // Exclui todos os pedidos relacionados ao consumidor
    await OrdersModel.deleteMany({ consumer: id });

    return {
      msg: "Consumidor excluído com sucesso",
    };
  }

  /**
   * Busca um consumidor específico por ID
   * @param {string} user - ID do usuário
   * @param {string} id - ID do consumidor
   * @returns {Object} - Dados do consumidor
   */
  static async getById(user, id) {
    const checkExist = await ConsumerModel.findOne({ _id: id, user: user });

    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Consumidor não encontrado");
      return;
    }

    return {
      user: checkExist,
    };
  }

  /**
   * Busca todos os consumidores com paginação e filtros
   * @param {string} user - ID do usuário
   * @param {number} page - Número da página
   * @param {string} query - Termo de busca
   * @returns {Object} - Lista de consumidores e informações de paginação
   */
  static async GetAllUser(user, page = 1, query = "") {
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    // Query com filtros de busca
    const queryies = {
      user,
      $or: [
        {
          name: new RegExp(query),
        },
        {
          email: new RegExp(query),
        },
        {
          address: new RegExp(query),
        },
        {
          mobile: new RegExp(query),
        },
      ],
    };

    // Busca consumidores com paginação
    const data = await ConsumerModel.find(queryies)
      .select("name email mobile")
      .skip(skip)
      .limit(limit);

    // Conta total de consumidores para paginação
    const totalConsumer = await ConsumerModel.countDocuments(queryies);
    const hasMore = skip + limit < totalConsumer;

    return {
      users: data,
      more: hasMore,
    };
  }

  /**
   * Atualiza dados de um consumidor
   * @param {string} user - ID do usuário
   * @param {Object} body - Novos dados do consumidor
   * @param {string} id - ID do consumidor a ser atualizado
   * @returns {Object} - Mensagem de sucesso
   */
  static async updateById(user, body, id) {
    const { name, email, mobile, dob, address } = body;

    const checkExist = await ConsumerModel.findById({ _id: id });

    // Verifica se o email foi alterado e se já existe
    if (checkExist.email !== email) {
      const checkExistEmail = await ConsumerModel.findOne({
        email: email,
        user: user,
      });

      if (checkExistEmail) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "E-mail do consumidor já cadastrado em outro registro"
        );
        return;
      }
    }

    // Atualiza o consumidor
    await ConsumerModel.findByIdAndUpdate(id, {
      name,
      email,
      mobile,
      dob,
      address,
      user,
    });

    return {
      msg: "Consumidor atualizado com sucesso",
    };
  }

  /**
   * Busca consumidores para seleção em dropdowns
   * @param {string} user - ID do usuário
   * @returns {Object} - Lista de consumidores com nome e data de nascimento
   */
  static async GetUserForSearch(user) {
    const data = await ConsumerModel.find({ user }).select("name dob");

    return {
      users: data,
    };
  }

  /**
   * Obtém dados para o dashboard
   * @param {string} user - ID do usuário
   * @returns {Object} - Estatísticas de consumidores, pedidos e vendas
   */
  static async DashboardData(user) {
    const consumers = await ConsumerModel.countDocuments({ user });
    const orders = await OrdersModel.find({ user }).select("items.price -_id");

    const arr = await orders.map((cur) => {
      return [...cur.items.map((c) => c.price)];
    });

    return {
      consumers,
      orders: orders.length,
      sell: arr.length > 0 ? arr.flat(2).reduce((a, c) => a + c) : arr,
    };
  }
}

module.exports = ConsumerService;
