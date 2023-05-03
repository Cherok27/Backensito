const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email requerido"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  nombreCompleto: {
    type: String,
    description: "nombre del usuario",
  },
  numero: {
    type: String,
    trim: true,
  },
  carritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Carrito" }],
});

module.exports = mongoose.model("Usuario", usuarioSchema);
