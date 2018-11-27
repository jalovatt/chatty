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
      nav: {},
      messages: messages,
      chatBar: {}
    }
  }

  render() {
    return (
      <AppPresenter state={this.state} />
    );
  }
}
export default App;
