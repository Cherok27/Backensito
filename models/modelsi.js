const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  catidad: { type: Number, required: true },
  marca: { type: String, required: true },
  tipo: { type: String, required: true },
  carritos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Carrito" }],
});
module.exports = mongoose.model("Item", itemSchema);
