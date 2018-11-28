// server.js

const express = require('express');
const SocketServer = require('ws').Server;

const uuid = require("uuid/v4");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from
  // the /public folder
  .use(express.static('public'))
  .listen(
    PORT,
    '0.0.0.0',
    'localhost',
    () => console.log(`Listening on ${ PORT }`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });
const clients = {

  connections: {},

  add(socket) {
    const id = uuid();
    this.connections[id] = {id, socket};
    return id;
  },

  remove(id) {
    delete this.connections[id];
  },

  broadcast(data) {
    Object.keys(this.connections).forEach((id) => {
      this.send(id, data);
    });

  },

  send(id, data) {
    const msg = JSON.stringify(data);
    this.connections[id].socket.send(msg);
  },

  newMessage(data) {

    data.id = uuid();
    data.timestamp = new Date();
    this.broadcast(data);

  },

  newNotify(msg) {

    const data = {
      type: "notification",
      content: msg,
      id: uuid(),
      timestamp: new Date()
    }

    this.broadcast(data);

  },

  nameExists(name) {
    return false;
  },

  requestName(data) {

    console.log("user requested a name: " + data.content);

    const res = {};
    if (this.nameExists(data.content)) {
      res.type = "server-error";
      res.content = "That name is already in use";
    } else {
      res.type = "server-name";
      res.content = data.content;

      this.connections[data.id].name = data.content;
      this.newNotify(`${data.username} changed their name to ${data.content}`);
    }

    console.log("response:\n" + JSON.stringify(res));

    this.send(data.id, res);
  },

  sendId(id) {
    const msg = {
      type: "server-id",
      content: id
    };

    this.send(id, msg);
  }
};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on("message", (msg) => {

    const data = JSON.parse(msg);

    switch (data.type) {
    case "message":
      clients.newMessage(data);
      return;
    case "request-name":
      clients.requestName(data);
      return;
    }
  });

  const id = clients.add(ws);
  clients.sendId(id);

  // Set up a callback for when a client closes the socket. This usually means
  // they closed their browser.
  ws.on('close', () => clients.remove(id));


});
