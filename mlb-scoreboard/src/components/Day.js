import React, { Component } from 'react';

class Day extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="day">
        <button ref="prevDay" onClick={this.props.onChangeDay.bind(this, 'subtract')}>&lt;</button>
        <span className="selectedDay">{this.props.selectedDay.format('ll')}</span>
        <button ref="nextDay" onClick={this.props.onChangeDay.bind(this, 'add')}>&gt;</button>
      </div>
    );
  }

}

export default Day;
