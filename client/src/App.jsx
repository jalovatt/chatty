import React, {Component} from 'react';
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

function AppPresenter({props, cb}) {

  return (
    <div>
      <NavBar numUsers={props.nav.numUsers} />
      <MessageList messages={props.messages} cb={cb.messageList}/>
      <ChatBar user={props.user} cb={cb.chatBar} />
    </div>
  );

}

class App extends Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      user: {
        name: "",
        id: ""
      },
      nav: {
        numUsers: 0
      }
    }

    this.cb = {
      chatBar: {
        onNameSubmit: this.onNameSubmit.bind(this),
        onContentSubmit: this.onContentSubmit.bind(this),
        getChatCallbacks: this.getChatCallbacks.bind(this)
      },
      messageList: {
        getMsgCallbacks: this.getMsgCallbacks.bind(this),
      }
    }

  }

  send(msg) {

    msg.username = this.state.user.name;
    msg.id = this.id;

    // console.log("SENDING MESSAGE:");
    // console.dir(msg);

    this.socket.send(JSON.stringify(msg));
  }

  onNameSubmit(newName) {

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

  getMsgCallbacks(cbs) {
    this.cb.scrollToBottom = cbs.scrollToBottom;
  }

  getChatCallbacks(cbs) {
    this.cb.updateName = cbs.updateName;
  }

  newMessage(msg) {
    const messages = this.state.messages.concat(msg);
    this.setState({messages});
    this.cb.scrollToBottom();
  }

  serverWelcome(msg) {

    this.id = msg.id;
    this.setState({
      nav: {numUsers: msg.numUsers},
      messages: [msg],
      user: {name: msg.name}});

    this.cb.updateName();

  }

  assignName(msg) {

    const user = {...this.state.user};
    user.name = msg.content;
    this.setState({user: user});
    this.cb.updateName();

  }

  serverUserChange(msg) {
    this.setState({nav: {numUsers: msg.numUsers}});
    this.newMessage(msg);
  }

  serverError(msg) {

    const err = {...msg};
    err.content = "Error: " + err.content;

    this.newMessage(err);

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
    case "server-user-change":
      this.serverUserChange(msg);
      return;
    case "server-welcome":
      this.serverWelcome(msg);
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
