import React, {Component} from 'react';
import Message from "./Message.jsx";

class MessageListPresenter extends Component {

  render() {

    // console.log("THIS");
    // console.dir(this);

    return (
      <main className="messages">
        {this.props.messages.map((msg) => <Message key={msg.id} msg={msg} />)}
        <div ref={elm => {this.props.cbScrollElement(elm);}}></div>
      </main>
    );
  }

}

class MessageList extends Component {

  constructor({cb}) {
    super();

    // Pass some functionality back to the App component so it can control
    // things as needed
    cb.getMsgCallbacks({
      scrollToBottom: this.scrollToBottom.bind(this),
    });
  }

  scrollToBottom() {
    this.scrollElement.scrollIntoView();
  }

  getScrollElement(elm) {
    this.scrollElement = elm;
  }

  render() {
    return <MessageListPresenter messages={this.props.messages} cbScrollElement={this.getScrollElement.bind(this)}/>;
  }

}

export default MessageList;
