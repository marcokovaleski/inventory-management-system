const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { validateToken } = require("../utils/Token.utils");

const Authentication = (req, res, next) => {
  try {
    const headers = req.headers["authorization"] || "";

    if (!headers || !headers.startsWith("Bearer ")) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Por favor, faça login primeiro"
      );
    }

    const auth_token = headers.split(" ")[1];

    if (!auth_token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Por favor, forneça um token válido"
      );
    }

    const data = validateToken(auth_token);
    req.user = data.userid;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = Authentication;
