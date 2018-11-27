import React, {Component} from 'react';

function ChatBarPresenter({username, content}) {

  return (

    <footer className="chatbar">
      <input className="chatbar-username" placeholder="Your Name (Optional)" value={username || ""} />
      <input className="chatbar-message" placeholder="Type a message and hit ENTER" value={content || ""} />
    </footer>

  );
}

class ChatBar extends Component {

  constructor(props) {
    super();
  }

  render() {
    const {currentUser, content} = this.props.state;
    return <ChatBarPresenter username={currentUser.name} content={content}/>;
  }

}

export default ChatBar;
