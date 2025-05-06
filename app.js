const express = require("express");
const cors = require("cors");

const morganBody = require("morgan-body");
require("dotenv").config();

const dbConnect = require("./config/mongo");
const routerUser = require("./routers/user");
const routerClient = require("./routers/client");
const routerProyect = require("./routers/projects");
const routerDeliveryNote = require("./routers/deliveryNote");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./docs/swagger");
const loggerStream = require("./utils/handleLogger");

const app = express();

const port = process.env.NODE_ENV === "test" ? 3001 : process.env.PORT;
//const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

// Rutas
app.use("/api/user", routerUser);
app.use("/api/client", routerClient);
app.use("/api/project", routerProyect);
app.use("/api/deliveryNote", routerDeliveryNote);

// Conectar a la base de datos
dbConnect();

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});

// Configurar Swagger
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
);

// Configurar morgan-body después de las rutas y la conexión a la base de datos
morganBody(app, {
    noColors: true,
    skip: function (req, res) {
        return res.statusCode < 500;
    },
    stream: loggerStream
});

module.exports = {
    app, server
};
