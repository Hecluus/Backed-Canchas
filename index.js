require("dotenv").config();
const Server = require("./models/server");

const server = new Server();

if (process.env.NODE_ENV !== "production") {
    server.listen();
}

module.exports = server.app;