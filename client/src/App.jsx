import React, {Component} from 'react';
import Header from "./Header.jsx";
import Background from "./Background.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

function AppPresenter({props, cb}) {

  return (
    <div>
      <Header numUsers={props.header.numUsers} connectedTo={props.header.connectedTo}/>
      <Background />
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
      header: {
        numUsers: 0,
        connectedTo: ""
      }
    }

    this.targetAddress = "localhost:3001"


    this.messageHandlers = {
      "server-user-change": this.serverUserChange,
      "server-welcome":     this.serverWelcome,
      "server-name":        this.assignName,
      "server-error":       this.serverError,
    }

    // For communicating with our children
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


  // These are passed to the MessageList and ChatBar components so they can
  // send a couple of functions back to us.
  getMsgCallbacks(cbs) {

    // So we can scroll the message list whenever a new message comes in
    this.cb.scrollToBottom = cbs.scrollToBottom;

  }

  getChatCallbacks(cbs) {

    // So we can force an update to the displayed username
    this.cb.updateName = cbs.updateName;

  }


  newMessage(msg) {
    const messages = this.state.messages.concat(msg);
    this.setState({messages});
    this.cb.scrollToBottom();
  }


  // Initial response from the server with credentials and initial state
  serverWelcome(msg) {

    msg.type = "notification";

    this.id = msg.id;
    this.setState({
      header: {
        numUsers: msg.numUsers,
        connectedTo: this.targetAddress
      },
      messages: [msg],
      user: {name: msg.name}
    });

    this.cb.updateName();

  }


  // Update our username since the server said it was okay and force
  // the chatbar to update its copy
  assignName(msg) {

    const user = {...this.state.user};
    user.name = msg.content;
    this.setState({user: user});
    this.cb.updateName();

  }

  // Someone joined or left
  serverUserChange(msg) {

    // console.log("USER CHANGE");
    // console.dir(msg);

    const header = this.state.header;
    header.numUsers= msg.numUsers;

    this.setState({header});
    this.newMessage(msg);
  }


  serverError(msg) {

    const err = {...msg};
    err.content = "Error: " + err.content;

    this.newMessage(err);

  }


  // Routing logic for messages from the server
  incomingMessage(e) {

    const msg = JSON.parse(e.data);

    // console.log("INCOMING MESSAGE:");
    // console.dir(msg);

    const handler = this.messageHandlers[msg.type] || this.newMessage;
    handler.bind(this)(msg);

  }

  connectToServer() {

    const socket = new WebSocket(`ws://${this.targetAddress}`);
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
