const log = (req, res, next) => {
  console.log("Logging..."); // ! Aquí vendría toda la funcionalidad del login de usuario
  next();
};

module.exports = log;
