import React, {Component} from 'react';

function ChatBarPresenter({props}) {

  return (

    <footer className="chatbar">
      <input
        className="chatbar-username"
        placeholder="Your Name (Optional)"
        value={props.userBuffer || ""}
        onChange={props.onNameChange}
        onBlur={props.onNameBlur}
        onKeyPress={props.onNameKeyPress}
      />
      <input
        className="chatbar-message"
        placeholder="Type a message and hit ENTER"
        value={props.content || ""}
        onChange={props.onContentChange}
        onKeyPress={props.onContentKeyPress}
      />
    </footer>

  );
}

class ChatBar extends Component {

  constructor(props) {
    super();
  }

  render() {
    const props = this.props.props;

    return (
      <ChatBarPresenter
        props={props}
      />
    );
  }

}

export default ChatBar;
