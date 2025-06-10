const httpStatus = require("http-status");
const { UserModel, ProfileModel } = require("../models");
const ApiError = require("../utils/ApiError");
const { generatoken } = require("../utils/Token.utils");
const axios = require("axios");

const isProduction = process.env.NODE_ENV === "production";

async function verifyCaptcha(token) {
  if (!isProduction) {
    console.log("Captcha ignorado no ambiente de desenvolvimento");
    return true;
  }

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify`,
    {},
    {
      params: {
        secret: process.env.CAPTCHA_SCREATE_KEY,
        response: token,
      },
    }
  );

  const data = response.data;
  return data.success;
}

class AuthService {
  static async RegisterUser(body) {
    const { email, password, name, token } = body;

    const isValid = await verifyCaptcha(token);
    if (!isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    const checkExist = await UserModel.findOne({ email });
    if (checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Already Registered");
    }

    const user = await UserModel.create({ email, password, name });
    const tokend = generatoken(user);
    const refresh_token = generatoken(user, "2d");

    await ProfileModel.create({
      user: user._id,
      refresh_token,
    });

    return {
      msg: "Usuário registrado com sucesso",
      token: tokend,
    };
  }

  static async LoginUser(body) {
    const { email, password, token } = body;

    const isValid = await verifyCaptcha(token);
    if (!isValid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Captcha Not Valid");
    }

    const checkExist = await UserModel.findOne({ email });
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
    }

    if (password !== checkExist.password) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Credentials");
    }

    const tokend = generatoken(checkExist);
    return {
      msg: "Usuário logado com sucesso",
      token: tokend,
    };
  }

  static async ProfileService(user) {
    const checkExist = await UserModel.findById(user).select("name email");
    if (!checkExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User Not Registered");
    }

    return {
      msg: "Dados obtidos com sucesso",
      user: checkExist,
    };
  }
}

module.exports = AuthService;
