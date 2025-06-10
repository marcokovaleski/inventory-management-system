const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lower: true,
      required: [true, "E-mail é obrigatório"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Senha é obrigatória"],
    },
  },
  { timestamps: true }
);

const model = mongoose.model("user", Schema);
module.exports = model;
