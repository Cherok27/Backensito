const Carrito = require("../models/modelsc");
const Items = require("../models/modelsi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const checkAuth = require("../middleware/chek-auth");
const router = express.Router();
// router.use(checkAuth);
router.get("/", async (req, res, next) => {
  let carritos;
  try {
    carritos = await Carrito.find({}).populate("items");
  } catch (err) {
    console.log(err);
    const error = new Error("Ha ocurrido un error en la recuperación de datos");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    mensaje: "Todos los usuarios",
    carritos: carritos,
  });
});
router.post("/", async (req, res, next) => {
  const { usuario } = req.body;

  const nuevoDocente = new Carrito({
    usuario,
    items: [],
  });
  try {
    await nuevoDocente.save();
  } catch (error) {
    console.log(error);
    const err = new Error("No se han podido guardar los datos");
    err.code = 500;
    return next(err);
  }

  res.status(201).json({
    userId: nuevoDocente.id,
    docente: nuevoDocente,
  });
});
router.patch("/:id", async (req, res, next) => {
  const idUsuario = req.params.id;
  let usuarioCarrito;
  try {
    usuarioCarrito = await Carrito.findById(idUsuario);
  } catch (err) {
    const error = new Error(
      "Ha habido algún error. No se han podido recuperar los datos"
    );
    error.code = 500;
    return next(error);
  }
  if (!usuarioCarrito) {
    const error = new Error(
      "No se ha podido encontrar un usuario con el id proporcionado"
    );
    error.code = 404;
    return next(error);
  }
  if (req.body.item) {
    usuarioItem = await Items.findById(req.body.item);
    usuarioCarrito.items.push(usuarioItem);
    usuarioCarrito.save();
  }
  try {
    cambiarDatos = await Carrito.findByIdAndUpdate(idUsuario, req.body, {
      new: true,
      runValidators: true,
    }).populate("usuario");
  } catch (error) {
    const err = new Error("Nos e han podido actulizar los datos");
    err.code = 500;
    return next(error);
  }
  res.status(200).json({ mensaje: "modificado", usuarios: cambiarDatos });
});
router.patch("/delete/:id", async (req, res, next) => {
  const idCarrito = req.params.id;
  let usuarioCarrito;
  try {
    usuarioCarrito = await Carrito.findById(idCarrito);
  } catch (err) {
    const error = new Error(
      "Ha habido algún error. No se han podido recuperar los datos"
    );
    error.code = 500;
    return next(error);
  }
  if (!usuarioCarrito) {
    const error = new Error(
      "No se ha podido encontrar un usuario con el id proporcionado"
    );
    error.code = 404;
    return next(error);
  }
  if (req.body.items) {
    usuarioItem = await Carrito.findById(req.body.items).populate("items");
    console.log(usuarioItem);

    usuarioCarrito.items.pull(usuarioItem);

    usuarioCarrito.save();
  }
  try {
    cambiarDatos = await Carrito.findByIdAndUpdate(idCarrito, req.body, {
      new: true,
      runValidators: true,
    }).populate("items");
  } catch (error) {
    const err = new Error("Nos e han podido actulizar los datos");
    err.code = 500;
    return next(error);
  }
  res.status(200).json({ mensaje: "modificado", carritos: cambiarDatos });
});
module.exports = router;
