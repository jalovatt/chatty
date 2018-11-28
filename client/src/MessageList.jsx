import React, {Component} from 'react';
import Message from "./Message.jsx";

function MessageListPresenter({messages}) {

  return (
    <main className="messages">
      {messages.map((msg) => <Message key={msg.id} msg={msg} />)}
    </main>
  );

}

class MessageList extends Component {

  constructor(props) {
    super();
  }

  render() {
    return <MessageListPresenter messages={this.props.messages} />;
  }

}

export default MessageList;
