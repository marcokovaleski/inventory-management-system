const AuthController = require("../controllers/Auth.controller");
const Authentication = require("../middlewares/Authentication");
const Validation = require("../middlewares/Validation");
const AuthValidation = require("../validations/Auth.validation");
const CaptchaBypass = require("../middlewares/CaptchaBypass");

const router = require("express").Router();

router.post(
  "/register",
  CaptchaBypass,
  AuthValidation.RegisterUser,
  Validation,
  AuthController.RegisterUser
);
router.post(
  "/login",
  CaptchaBypass,
  AuthValidation.LoginUser,
  Validation,
  AuthController.LoginUser
);
router.get("/profile", Authentication, AuthController.ProfileController);

module.exports = router;
