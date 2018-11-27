import React, {Component} from 'react';

function MessagePresenter({msg: {type, username, content}}) {

  let timestamp;

  switch (type) {
  default:
    return (
      <div className="message">
        <span className="message-username">{username}</span>
        <span className="message-content">{content}</span>
        <span className="message-timestamp">{timestamp || "1:23:45pm"}</span>
      </div>
    );
  case "incomingNotification":
    return (
      <div className="message system">{content}</div>
    );
  }

}

class Message extends Component {

  constructor(props) {
    super();
  }

  render() {
    console.log("rendering message from:\n\t" + JSON.stringify(this.props.msg));
    return <MessagePresenter msg={this.props.msg}/>
  }

}

export default Message;
