const { response } = require("express");
const express = require("express");
const Carrito = require("../models/modelsc");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usuario = require("../models/models");

const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  let usuarios;
  try {
    usuarios = await Usuario.find({}).populate("carritos");
  } catch (err) {
    console.log(err);
    const error = new Error("Ha ocurrido un error en la recuperación de datos");
    error.code = 500;
    return next(error);
  }
  res.status(200).json({
    mensaje: "Todos los usuarios",
    usuarios: usuarios,
  });
});
router.get("/:id", async (req, res, next) => {
  const idUsuario = req.params.id;
  let usuario;
  try {
    usuario = await Usuario.findById(idUsuario);
  } catch (err) {
    const error = new Error(
      "Ha habido algún error. No se han podido recuperar los datos"
    );
    error.code = 500;
    return next(error);
  }
  if (!usuario) {
    const error = new Error(
      "No se ha podido encontrar un usuario con el id proporcionado"
    );
    error.code = 404;
    return next(error);
  }
  res.json({
    mensaje: "usuario encontrado",
    usuario: usuario,
  });
});
router.post("/", async (req, res, next) => {
  const { email, password, nombreCompleto, numero } = req.body;
  let existeDocente;
  try {
    existeDocente = await Usuario.findOne({
      email: email,
    });
  } catch (err) {
    const error = new Error(err);
    error.code = 500;
    return next(error);
  }
  if (existeDocente) {
    const error = new Error("Ya existe un usuario con ese e-mail.");
    error.code = 401; // 401: fallo de autenticación
    return next(error);
  } else {
    let hashedPassword = await bcrypt.hash(password, 12);
    const nuevoDocente = new Usuario({
      email,
      password: hashedPassword,
      nombreCompleto,
      numero,
      carritos: [],
    });
    const usuario = nuevoDocente.id;
    console.log(usuario);
    const nuevoCarrito = new Carrito({
      usuario: usuario,
      items: [],
    });
    const carritoId = nuevoCarrito.id;

    try {
      await nuevoDocente.save();
      await nuevoCarrito.save();
    } catch (error) {
      console.log(error);
      const err = new Error("No se han podido guardar los datos");
      err.code = 500;
      return next(err);
    }
    try {
      await Usuario.findByIdAndUpdate(usuario, { carritos: carritoId });
    } catch (error) {
      console.log(error);
      const err = new Error("no se metio a carrito");
    }

    res.status(201).json({
      userId: nuevoDocente.id,
      docente: nuevoDocente,
      email: nuevoDocente.email,
    });
  }
});
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let usuarioExiste;
  try {
    usuarioExiste = await Usuario.findOne({
      email: email,
    });
  } catch (error) {
    const err = new Error(
      "No se ha podido realizar la operación. Pruebe más tarde"
    );
    err.code = 500;
    return next(err);
  }
  let esValidoElPassword = false;
  esValidoElPassword = bcrypt.compareSync(password, usuarioExiste.password);
  if (!esValidoElPassword) {
    const error = new Error(
      "No se ha podido identificar al usuario. Credenciales erróneos"
    );
    error.code = 401; // !401: Fallo de autenticación
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: usuarioExiste.id,
        email: usuarioExiste.email,
      },
      "pene",
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    console.log(error);
    const err = new Error("El proceso de login ha fallado");
    err.code = 500;
    return next(err);
  }
  res.status(201).json({
    mensaje: "Usuario ha entrado con éxito en el sistema",
    email: usuarioExiste.email,
    userId: usuarioExiste.id,
    token: token,
  });
});
router.patch("/:id", async (req, res, next) => {
  const idUsuario = req.params.id;
  let usuario;
  try {
    usuario = await Usuario.findById(idUsuario);
  } catch (err) {
    const error = new Error(
      "Ha habido algún error. No se han podido recuperar los datos"
    );
    error.code = 500;
    return next(error);
  }
  if (!usuario) {
    const error = new Error(
      "No se ha podido encontrar un usuario con el id proporcionado"
    );
    error.code = 404;
    return next(error);
  }
  if (req.body.item) {
    usuarioCarrito = await Carrito.findById(req.body.item);
    usuario.carritos.push(usuarioCarrito);
    usuario.save();
  }
  try {
    cambiarDatos = await Usuario.findByIdAndUpdate(idUsuario, req.body, {
      new: true,
      runValidators: true,
    }).populate("carritos");
  } catch (error) {
    const err = new Error("Nos e han podido actulizar los datos");
    err.code = 500;
    return next(error);
  }
  res.status(200).json({ mensaje: "modificado", usuarios: cambiarDatos });
});

module.exports = router;
