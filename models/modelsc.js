const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },

  estado: { type: String, enum: ["abierto", "cerrado"], default: "abierto" },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
});

module.exports = mongoose.model("Carrito", carritoSchema);
