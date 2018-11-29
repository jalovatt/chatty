const connections = {};

module.exports = function(uuid) {

  return {

    addUser(socket) {

      const id = uuid();
      const name = this.randomName(this.nameExists.bind(this));
      const numUsers = this.userCount() + 1;

      const data = {
        type: "server-user-change",
        content: `${name} has connected. There are now ${numUsers} users online.`,
        id: uuid(),
        timestamp: new Date(),
        numUsers
      }

      this.broadcast(data);

      connections[id] = {id, name, socket};
      this.welcomeUser(id, name);

      return id;

    },


    removeUser(id) {

      const name = connections[id].name;
      delete connections[id];

      const numUsers = this.userCount();

      const data = {
        type: "server-user-change",
        content: `${name} has disconnected. There are ${numUsers} users still online.`,
        id: uuid(),
        timestamp: new Date(),
        numUsers
      };

      this.broadcast(data);

    },


    welcomeUser(id, name) {

      const numUsers = this.userCount();

      const msg = {
        type: "server-welcome",
        content: `Welcome, ${name}. There are ${numUsers} users online. Type /me ... to perform actions or /img ...URL... to display an image.`,
        id,
        name,
        timestamp: new Date(),
        numUsers: numUsers
      };

      this.send(id, msg);

    },


    broadcast(data) {
      Object.keys(connections).forEach((id) => {
        if (connections[id].socket.readyState !== 1) return;
        this.send(id, data);
      });

    },


    send(id, data) {
      const msg = JSON.stringify(data);
      connections[id].socket.send(msg);
    },


    randomName(exists) {

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
      case "img":
        out.content = text;
        out.type = "image";
        return out;
      }
    },


    message(msg) {

      const data = JSON.parse(msg);

      // Check for any special request types
      switch (data.type) {
      case "request-name":
        this.requestName(data);
        return;
      }

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


    userCount() {
      return Object.keys(connections).length;
    }

  };
};
