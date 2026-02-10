const express = require("express");
const cors = require("cors");
const { conexionBD } = require("../database/config");

const allowedOrigins = [
  "https://golazogourmett.netlify.app",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-token"]
};

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;

    this.canchasPath = "/api/canchas";
    this.reservasPath = "/api/reservas";
    this.comidasPath = "/api/comidas";
    this.categoriasPath = "/api/categorias";
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";
    this.mpPath = "/api/create-preference";
    this.pedidosPath = "/api/pedidos";
    this.webhookPath = "/api/webhook";

    this.conectarBD();
    this.middleware();
    this.routes();
  }

  async conectarBD() {
    await conexionBD();
  }

  middleware() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.canchasPath, require("../routes/canchas"));
    this.app.use(this.reservasPath, require("../routes/reservas"));
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.comidasPath, require("../routes/comidas"));
    this.app.use(this.categoriasPath, require("../routes/categorias"));
    this.app.use(this.mpPath, require("../routes/mercadoPago"));
    this.app.use(this.pedidosPath, require("../routes/pedidos"));
    this.app.use(this.webhookPath, require("../routes/mpWebhook"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;