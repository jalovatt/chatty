import React, {Component} from 'react';
import messages from "./data/messages";
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
      messages: messages,
      currentUser: {name: "Adam"}
    }

    this.cb = {
      chatBar: {
        onNameSubmit: this.onNameSubmit.bind(this),
        onContentSubmit: this.onContentSubmit.bind(this)
      }
    }

  }

  onNameSubmit(newName) {

    const chatState = {...this.state};
    const oldName = chatState.currentUser.name;

    const messages = this.state.messages.concat({
      type: "incomingNotification",
      content: `${oldName} changed their name to ${newName}`
    });

    chatState.currentUser.name = newName;
    this.setState({
      chatBar: chatState,
      messages
    });

    return newName;

  }

  onContentSubmit(content) {

    const msg = {
      type: "incomingMessage",
      content,
      username: this.state.currentUser.name
    };

    const messages = this.state.messages.concat(msg);
    this.setState({messages});

  }

  componentDidMount() {

    setTimeout(() => {
      console.log("Simulating incoming message");

      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage);

      this.setState({messages: messages});
    }, 3000);

  }

  render() {
    return (
      <AppPresenter props={this.state} cb={this.cb}/>
    );
  }
}
export default App;
