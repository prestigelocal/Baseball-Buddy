import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

class Game extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let runs = {
      away: '',
      home: ''
    };

    let defaultClasses = { 'team': true };
    let awayClasses = _.assign({}, defaultClasses, {
      'team--away': true
    });
    let homeClasses = _.assign({}, defaultClasses, {
      'team--home': true
    });

    if (_.has(this.props, 'linescore.r')) {
      runs = this.props.linescore.r;

      if (
        this.props.status.status === 'Final' ||
        this.props.status.status === 'Game Over' ||
        this.props.status.status === 'Completed Early'
        ) {
        awayClasses = _.assign({}, awayClasses, {
          'winner': Number(runs.away) > Number(runs.home)
        });
        homeClasses = _.assign({}, homeClasses, {
          'winner': Number(runs.home) > Number(runs.away)
        });
      }
    }

    let status = this.props.status.status;
    if (status === 'Preview') {
      status = `${this.props.time} ${this.props.time_zone} - ${this.props.venue}`;
    } else {
      if (!_.isEmpty(this.props.status.reason)) {
        status += ` (${this.props.status.reason})`;
      }
    }

    return (
      <div className="game">
        <div className={classNames(awayClasses)}>
          <div className="team-name">{this.props.away_team_name} <span className="team-name--record">({this.props.away_win}-{this.props.away_loss})</span></div>
          <div className="team-score">{runs.away}</div>
        </div>
        <div className={classNames(homeClasses)}>
          <div className="team-name">{this.props.home_team_name} <span className="team-name--record">({this.props.home_win}-{this.props.home_loss})</span></div>
          <div className="team-score">{runs.home}</div>
        </div>
        <div className="game-status">
          {status}
        </div>
      </div>
    );
  }

}

export default Game;
