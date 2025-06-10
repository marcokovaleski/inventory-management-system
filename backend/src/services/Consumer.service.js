const httpStatus = require("http-status");
const { ConsumerModel, OrdersModel } = require("../models");
const ApiError = require("../utils/ApiError");
class ConsumerService {
  static async RegisterConsumer(user, body) {
    const { name, email, mobile, dob, address } = body;

    const checkExist = await ConsumerModel.findOne({
      email: email,
      user: user,
    });

    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Consumidor já cadastrado");
      return;
    }

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

  static async DeleteConsumer(user, id) {
    const checkExist = await ConsumerModel.findOneAndDelete({
      _id: id,
      user: user,
    });

    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Consumidor não encontrado");
      return;
    }

    await OrdersModel.deleteMany({ consumer: id });

    return {
      msg: "Consumidor excluído com sucesso",
    };
  }
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

  static async GetAllUser(user, page = 1, query = "") {
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

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

    const data = await ConsumerModel.find(queryies)
      .select("name email mobile")
      .skip(skip)
      .limit(limit);

    const totalConsumer = await ConsumerModel.countDocuments(queryies);

    const hasMore = skip + limit < totalConsumer;

    return {
      users: data,
      more: hasMore,
    };
  }

  static async updateById(user, body, id) {
    const { name, email, mobile, dob, address } = body;

    const checkExist = await ConsumerModel.findById({ _id: id });

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

  static async GetUserForSearch(user) {
    const data = await ConsumerModel.find({ user }).select("name dob");

    return {
      users: data,
    };
  }
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
