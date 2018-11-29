import React, {Component} from 'react';

function ChatBarPresenter({nameBuffer, contentBuffer, cb}) {

  return (

    <footer className="chatbar">
      <input
        className="chatbar-username"
        placeholder="Your Name (Optional)"
        value={nameBuffer || ""}
        onChange={cb.onNameChange}
        onBlur={cb.onNameBlur}
        onKeyPress={cb.onNameKeyPress}
      />
      <input
        className="chatbar-message"
        placeholder="Type a message and hit ENTER"
        value={contentBuffer || ""}
        onChange={cb.onContentChange}
        onKeyPress={cb.onContentKeyPress}
      />
    </footer>

  );
}

class ChatBar extends Component {

  constructor({user, content, cb}) {
    super();

    this.state = {
      nameBuffer: user.name,
      contentBuffer: content
    }

    this.cb = {
      onNameChange:       this.onNameChange.bind(this),
      onNameBlur:         this.onNameBlur.bind(this),
      onNameKeyPress:     this.onNameKeyPress.bind(this),
      onContentChange:    this.onContentChange.bind(this),
      onContentKeyPress:  this.onContentKeyPress.bind(this)
    }

    cb.getNameCB(this.useNameFromProps.bind(this));

  }

  onNameChange(e) {
    this.setState({nameBuffer: e.target.value});
  }

  useNameFromProps() {
    this.setState({nameBuffer: this.props.user.name});
  }

  onNameBlur(e) {
    this.useNameFromProps();
  }

  onNameKeyPress(e) {

    if (e.key !== "Enter") return;

    // Passing the element as a callback so App can blur it
    // after the name-change request comes back
    this.props.cb.onNameSubmit(e.target.value, this.useNameFromProps.bind(this));

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

    return (
      <ChatBarPresenter
        {...this.state}
        cb={this.cb}
      />
    );

  }

}

export default ChatBar;
