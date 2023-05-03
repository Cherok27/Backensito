const auth = (req, res, next) => {
  console.log("Autenticando..."); // ! Aquí vendría toda la funcionalidad del login de usuario
  next();
};
module.exports = auth;
