import React, {Component} from 'react';

class Header extends Component {

  render() {
    return (
      <header className="status-bar">
        <span className="status-bar-connected-to">Connected To: {this.props.connectedTo}</span>
        <span className="status-bar-num-users">Users: {this.props.numUsers}</span>
      </header>
    )
  }

}

export default Header;
