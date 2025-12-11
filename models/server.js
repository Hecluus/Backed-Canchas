const express = require("express");
const cors = require("cors");
const { conexionBD } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.canchasPath = "/api/canchas";
        this.reservasPath = "/api/reservas";
        this.conectarBD();
        this.middleware();
        this.routes();
    }

    async conectarBD() {
        await conexionBD();
    }

    middleware() {
        this.app.use(cors());
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
