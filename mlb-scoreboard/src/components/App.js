import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import Header from './Header.js';
import Scoreboard from './Scoreboard.js';

class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <RouteHandler params={this.props.params} />
      </div>
    );
  }

}

export default App;
