module.exports = function(wss, clients) {

  wss.on("connection", (ws) => {

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

    const [id, name] = clients.add(ws);
    clients.welcome(id, name);

    // Set up a callback for when a client closes the socket.
    ws.on("close", () => clients.remove(id));

  });

};
