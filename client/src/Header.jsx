import React, {Component} from 'react';

class Header extends Component {

  constructor(props) {
    super();
  }

  render() {
    console.dir(this.props);
    return (
      <header>
        <span className="connected-to">Connected To: {this.props.connectedTo}</span>
        <span className="num-users">Users: {this.props.numUsers}</span>
      </header>
    )
  }

}

export default Header;
