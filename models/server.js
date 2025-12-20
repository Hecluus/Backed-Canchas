const express = require("express");
const cors = require("cors");
const { conexionBD } = require("../database/config");

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token']
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
        this.authPath = "/api/auth/login";

        this.conectarBD();
        this.middleware();
        this.routes();
    }

    async conectarBD() {
        await conexionBD();
    }

    middleware() {
        this.app.use(cors(corsOptions));
        this.app.options('*', cors(corsOptions));
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
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;
