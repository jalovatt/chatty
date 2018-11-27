import React, {Component} from 'react';

function ChatBarPresenter({props, cb}) {

  return (

    <footer className="chatbar">
      <input
        className="chatbar-username"
        placeholder="Your Name (Optional)"
        value={props.nameBuffer || ""}
        onChange={cb.onNameChange}
        onBlur={cb.onNameBlur}
        onKeyPress={cb.onNameKeyPress}
      />
      <input
        className="chatbar-message"
        placeholder="Type a message and hit ENTER"
        value={props.contentBuffer || ""}
        onChange={cb.onContentChange}
        onKeyPress={cb.onContentKeyPress}
      />
    </footer>

  );
}

class ChatBar extends Component {

  constructor({user, content}) {
    super();

    this.state = {
      nameBuffer: user.name,
      contentBuffer: content
    }

  }

  onNameChange(e) {

    this.setState({nameBuffer: e.target.value});

  }

  onNameBlur(e) {

    this.setState({nameBuffer: this.props.user.name});

  }

  onNameKeyPress(e) {

    if (e.key !== "Enter") return;
    const newName = this.props.cb.onNameSubmit(e.target.value);

    this.setState({nameBuffer: newName});

  }

  onContentChange(e) {

    this.setState({contentBuffer: e.target.value});

  }

  onContentKeyPress(e) {

    if (e.key !== "Enter") return;
    this.props.cb.onContentSubmit(e.target.value);

    this.setState({contentBuffer: ""});

  }

  render() {

    const cb = {
      onNameChange:       this.onNameChange.bind(this),
      onNameBlur:         this.onNameBlur.bind(this),
      onNameKeyPress:     this.onNameKeyPress.bind(this),
      onContentChange:    this.onContentChange.bind(this),
      onContentKeyPress:  this.onContentKeyPress.bind(this)
    }

    return (
      <ChatBarPresenter
        props={this.state}
        cb={cb}
      />
    );
  }

}

export default ChatBar;
