// const auth = require("./middleware/auth");
// const logger = require("./middleware/logger");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
const rutasUsuarios = require("./routes/rutas-users");
app.use("/api/Usuarios", rutasUsuarios);

const rutasCarritos = require("./routes/rutas-carrito");
app.use("/api/Carritos", rutasCarritos);
const rutasItems = require("./routes/rutas-items");
app.use("/api/Items", rutasItems);
// const rutasCarritos = require("./routes/rutas-carrito");
// app.use("/api/Carritos", rutasCarritos);

// app.use(logger);

require("dotenv").config();
app.use(express.json());

app.use((req, res) => {
  res.status(404);
  res.json({
    mensaje: "Información no encontrada",
  });
});

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log("💯 Conectado con éxito a Atlas");
    app.listen(process.env.PORT, () =>
      console.log(`Escuchando en puerto ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log(error));
