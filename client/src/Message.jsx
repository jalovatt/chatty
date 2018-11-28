import React, {Component} from 'react';

function MessagePresenter({msg}) {

  let timestamp;

  switch (msg.type) {
  default:
    const time = new Date(msg.timestamp).toLocaleTimeString();
    return (
      <div className="message">
        <span className="message-username">{msg.username}</span>
        <span className="message-content">{msg.content}</span>
        <span className="message-timestamp">{time}</span>
      </div>
    );
  case "notification":
    return (
      <div className="message system">{msg.content}</div>
    );
  }

}

class Message extends Component {

  constructor(props) {
    super();
  }

  render() {
    return <MessagePresenter msg={this.props.msg}/>
  }

}

export default Message;
