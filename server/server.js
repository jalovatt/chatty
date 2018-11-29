const express = require("express");
const SocketServer = require("ws").Server;

const PORT = 3001;
const server = express()
  .use(express.static("public"))
  .listen(
    PORT,
    "0.0.0.0",
    "localhost",
    () => console.log(`Listening on ${ PORT }`)
  );

const uuid = require("uuid/v4");
const clients = require("./services/clients")(uuid);

const wss = new SocketServer({ server });

const router = require("./services/router")(wss, clients);
