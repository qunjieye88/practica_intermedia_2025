const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbConnect = require("./config/mongo");
const routerUser = require("./routers/user");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

// Rutas
app.use("/api/user", routerUser);

// Conectar a la base de datos
dbConnect();

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});


