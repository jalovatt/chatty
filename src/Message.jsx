import React, {Component} from 'react';

function MessagePresenter({msg: {type, username, content}}) {

  switch (type) {
  case "incomingMessage":
    return (
      <div className="message">
        <span className="message-username">{username}</span>
        <span className="message-content">{content}</span>
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
    return <MessagePresenter msg={this.props.msg}/>
  }

}

export default Message;
