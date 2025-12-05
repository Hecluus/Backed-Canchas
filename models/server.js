const express = require("express");
const cors = require("cors");
const { conexionBD } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;
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

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
