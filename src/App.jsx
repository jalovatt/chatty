import React, {Component} from 'react';
import messages from "./data/messages";
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

function AppPresenter({state}) {

  return (
    <div>
      <NavBar state={state.nav} />
      <MessageList messages={state.messages} />
      <ChatBar state={state.chatBar} />
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
        content: ""
      }
    }
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
      <AppPresenter state={this.state} />
    );
  }
}
export default App;
