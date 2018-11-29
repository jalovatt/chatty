module.exports = function(wss, clients) {

  wss.on("connection", (ws) => {

    ws.on("message", (msg) => {

      clients.message(msg);

    });

    const id = clients.addUser(ws);

    // Set up a callback for when a client closes the socket.
    ws.on("close", () => clients.removeUser(id));

  });

};
