const connections = {};

function randomName(exists) {

  const first = [
    "Cool",
    "n00b",
    "seXXX",
    "dark",
    "Loopy",
    "zer0",
    "ACID",
    "cr4sh",

  ];

  const last = [
    "lord",
    "Qu33n",
    "king",
    "inator",
    "Lighthouse",
    "c00l",
    "BURN",
    "0v3rr1d3",
  ];

  function rand(max) {
    return Math.floor(Math.random() * max);
  }

  let name;
  do {
    name = first[rand(first.length)] + last[rand(last.length)];
  } while (exists(name));

  return name;

}

module.exports = function(uuid) {

  return {

    add(socket) {
      const id = uuid();
      const name = randomName(this.nameExists.bind(this));

      const data = {
        type: "notification",
        content: `${name} has connected`,
        id: uuid(),
        timestamp: new Date()
      }

      this.broadcast(data);

      connections[id] = {id, name, socket};
      return [id, name];

    },

    remove(id) {

      const name = connections[id].name;

      const data = {
        type: "notification",
        content: `${name} has disconnected`,
        id: uuid(),
        timestamp: new Date()
      }

      delete connections[id];
      this.broadcast(data);

    },

    broadcast(data) {
      Object.keys(connections).forEach((id) => {
        this.send(id, data);
      });

    },

    send(id, data) {
      const msg = JSON.stringify(data);
      connections[id].socket.send(msg);
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
      };

      this.broadcast(data);

    },

    nameExists(name) {
      return Object.values(connections).find((client) => {
        return client.name === name;
      });
    },

    requestName(data) {

      const res = {};
      if (data.content === "") {
        res.type = "server-error";
        res.content = "You must have a name";
      } else if (this.nameExists(data.content)) {
        res.type = "server-error";
        res.content = "That name is already in use";
      } else {
        res.type = "server-name";
        res.content = data.content;

        connections[data.id].name = data.content;
        this.newNotify(`${data.username} changed their name to ${data.content}`);
      }

      this.send(data.id, res);
    },

    welcome(id, name) {
      const msg = {
        type: "server-welcome",
        content: `Welcome, ${name}`,
        id,
        name
      };

      this.send(id, msg);
    }

  };
};
