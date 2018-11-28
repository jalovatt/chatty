import React, {Component} from 'react';
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

function AppPresenter({props, cb}) {

  return (
    <div>
      <NavBar props={props.nav} />
      <MessageList messages={props.messages} />
      <ChatBar user={props.currentUser} cb={cb.chatBar} />
    </div>
  );

}

class App extends Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      currentUser: {name: "Adam"}
    }

    this.cb = {
      chatBar: {
        onNameSubmit: this.onNameSubmit.bind(this),
        onContentSubmit: this.onContentSubmit.bind(this)
      }
    }

  }

  send(msg) {

    msg.username = this.state.currentUser.name;
    msg.id = this.uuid;

    // console.log("SENDING MESSAGE:");
    // console.dir(msg);

    this.socket.send(JSON.stringify(msg));
  }

  onNameSubmit(newName) {

    const chatState = {...this.state};
    const oldName = chatState.currentUser.name;

    const msg = {
      type: "request-name",
      content: newName,
    }

    this.send(msg);

  }

  onContentSubmit(content) {

    const msg = {
      type: "message",
      content,
    };

    this.send(msg);

  }

  newMessage(msg) {
    const messages = this.state.messages.concat(msg);
    this.setState({messages});
  }

  serverMessage(msg) {

  }

  assignId(msg) {
    this.uuid = msg.content;
  }

  assignName(msg) {

    // console.log("ASSIGN NAME:");
    // console.dir(msg);

    const user = {...this.state.currentUser};
    user.name = msg.content;
    console.dir(user);
    this.setState({currentUser: user});

  }

  serverError(msg) {

    alert("Server error:\n" + msg.content);

  }

  incomingMessage(e) {

    const msg = JSON.parse(e.data);

    // console.log("INCOMING MESSAGE:");
    // console.dir(msg);

    switch (msg.type) {
    case "message":
    case "notification":
      this.newMessage(msg);
      return;
    case "server-id":
      this.assignId(msg)
      return;
    case "server-name":
      this.assignName(msg);
      return;
    case "server-error":
      this.serverError(msg);
      return;
    }

  }

  connectToServer() {

    const socket = new WebSocket("ws://localhost:3001");

    socket.onmessage = this.incomingMessage.bind(this);

    this.socket = socket;

  }

  componentDidMount() {
    this.connectToServer();
  }

  render() {
    return (
      <AppPresenter props={this.state} cb={this.cb}/>
    );
  }
}
export default App;
