const connections = {};

function randomName(exists) {

  const first = [
    "Cool",
    "n00b",
    "dark",
    "Loopy",
    "zer0",
    "ACID",
    "Crash",
    "lord",
    "Mr.The",
    "Ph4n70m",
    "cereal"
  ];

  const last = [
    "lord",
    "Qu33n",
    "king",
    "inator",
    "Lighthouse",
    "c00l",
    "BURN",
    "Override",
    "nikon",
    "Plague",
    "Phr34k",
    "killer"
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
        type: "server-user-change",
        content: `${name} has connected`,
        id: uuid(),
        timestamp: new Date(),
        numUsers: this.userCount() + 1
      }

      this.broadcast(data);

      connections[id] = {id, name, socket};
      return [id, name];

    },

    remove(id) {

      const name = connections[id].name;
      delete connections[id];

      const data = {
        type: "server-user-change",
        content: `${name} has disconnected`,
        id: uuid(),
        timestamp: new Date(),
        numUsers: this.userCount()
      };

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

    parseActions(data) {

      const match = data.content.slice(1).match(/^([^ ]+) (.+)/);

      if (!match) return data;

      const [action, text] = match.slice(1);
      // console.log(action + "\t\t" + text);

      const out = {...data};
      switch (action) {
      case "me":
        out.content = `${data.username} ${text}`;
        out.type = "notification";
        return out;
      }
    },

    newMessage(data) {

      data.id = uuid();
      data.timestamp = new Date();

      const out = (data.content[0] === "/")
        ? this.parseActions(data)
        : data;

      this.broadcast(out);

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
        name,
        numUsers: this.userCount()
      };

      this.send(id, msg);
    },

    userCount() {
      return Object.keys(connections).length;
    }

  };
};
