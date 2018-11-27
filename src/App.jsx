import React, {Component} from 'react';
import messages from "./data/messages";
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

function AppPresenter({props}) {

  return (
    <div>
      <NavBar props={props.nav} />
      <MessageList messages={props.messages} />
      <ChatBar props={props.chatBar} />
    </div>
  );

}

class App extends Component {

  constructor() {
    super();

    this.state = {
      messages: messages,
      chatBar: {
        currentUser: {name: "Adam"},
        userBuffer: "Adam",
        contentBuffer: "",
        onNameChange:       this.onNameChange.bind(this),
        onNameBlur:         this.onNameBlur.bind(this),
        onNameKeyPress:     this.onNameKeyPress.bind(this),
        onContentChange:    this.onContentChange.bind(this),
        onContentKeyPress:  this.onContentKeyPress.bind(this)
      }
    }
  }

  onNameChange(e) {

    const chatState = {...this.state.chatBar};
    chatState.userBuffer = e.target.value;

    this.setState({chatBar: chatState});

  }

  onNameBlur(e) {

    const chatState = {...this.state.chatBar};
    chatState.userBuffer = chatState.currentUser.name;

    this.setState({chatBar: chatState});

  }

  onNameKeyPress(e) {

    if (e.key !== "Enter") return;

    const chatState = {...this.state.chatBar};
    const oldName = chatState.currentUser.name;
    const newName = e.target.value;

    const messages = this.state.messages.concat({
      type: "incomingNotification",
      content: `${oldName} changed their name to ${newName}`
    });

    chatState.currentUser.name = newName;
    this.setState({
      chatBar: chatState,
      messages
    });

  }

  onContentChange(e) {
    const chatState = {...this.state.chatBar};
    chatState.content = e.target.value;
    this.setState({chatBar: chatState});
  }

  onContentKeyPress(e) {

    if (e.key !== "Enter") return;

    console.log(this.state);

    const msg = {
      type: "incomingMessage",
      content: e.target.value,
      username: this.state.chatBar.currentUser.name
    };

    const messages = this.state.messages.concat(msg);
    this.setState({messages});

  }

  componentDidMount() {

    console.log("componentDidMount <App />");
    setTimeout(() => {
      console.log("Simulating incoming message");

      const newMessage = {id: 3, username: "Michelle", content: "Hello there!"};
      const messages = this.state.messages.concat(newMessage);

      this.setState({messages: messages});
    }, 3000);

  }

  render() {
    return (
      <AppPresenter props={this.state} />
    );
  }
}
export default App;
