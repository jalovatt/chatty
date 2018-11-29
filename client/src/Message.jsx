import React, {Component} from 'react';

function MessagePresenter({msg}) {

  const time = new Date(msg.timestamp).toLocaleTimeString();

  switch (msg.type) {
  case "notification":
    return (
      <div className="message-system">{msg.content}</div>
    );
  case "image":
    return (
      <div className="message">
        <span className="message-username">{msg.username}</span>
        <img className="message-image" src={msg.content} />
        <span className="message-timestamp">{time}</span>
      </div>
    );
  default:
    return (
      <div className="message">
        <span className="message-username">{msg.username}</span>
        <span className="message-content">{msg.content}</span>
        <span className="message-timestamp">{time}</span>

      </div>
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
