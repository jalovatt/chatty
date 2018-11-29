import React, {Component} from 'react';

class NavBar extends Component {

  constructor(props) {
    super();
  }

  render() {
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Haxxy</a>
        <span className="num-users">Users Online: {this.props.numUsers}</span>
      </nav>
    )
  }

}

export default NavBar;
