const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dbConnect = require("./config/mongo");
const routerUser = require("./routers/user");
const routerClient = require("./routers/client")
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require("./docs/swagger")

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

// Rutas
app.use("/api/user", routerUser);
app.use("/api/client", routerClient);

// Conectar a la base de datos
dbConnect();

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})

app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)

module.exports = {
    app, server
}

