import React, { Component, PropTypes } from 'react';
import request from 'superagent';
import _ from 'lodash';
import moment from 'moment';

import Day from './Day.js';
import Scores from './Scores.js';

class Scoreboard extends Component {

  constructor(props) {
    super(props);

    let defaultDay = moment(new Date(this.props.params.date));
    let selectedDay = defaultDay.isValid() ? defaultDay : moment();

    this.state = {
      games: [],
      loadedGames: false,
      selectedDay: selectedDay,
      pollInterval: 60000,
      favTeam: 'Blue Jays'
    };
    this.getGames = this.getGames.bind(this);
    this.parseGames = this.parseGames.bind(this);
    this.setLoadedGames = this.setLoadedGames.bind(this);
    this.changeDay = this.changeDay.bind(this);
    this.setDayURL = this.setDayURL.bind(this);
  }

  componentDidMount() {
    this.getGames();
    setInterval(this.getGames, this.state.pollInterval);
    if (_.isUndefined(this.props.params.date)) {
      this.setDayURL();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only update if the loadedGames timestamp has changed
    // (after the games state has been updated with new data)
    return this.state.loadedGames !== nextState.loadedGames;
  }

  getGames() {
    let year = this.state.selectedDay.format('YYYY');
    let month = this.state.selectedDay.format('MM');
    let day = this.state.selectedDay.format('DD');

    request
      .get(`http://gd2.mlb.com/components/game/mlb/year_${year}/month_${month}/day_${day}/master_scoreboard.json`)
      .end((err, res) => {
        if (res.ok) {
          let gamesData = res.body.data.games;
          if (_.has(gamesData, 'game')) {
            // When one game, the 'game' property is an object;
            // force it into an array if this is the case.
            let games = !_.isArray(gamesData.game) ? [gamesData.game] : gamesData.game;

            // Only use the properties we actually need from this huge data set.
            games = this.parseGames(games);

            // Set new state only if games data has changed since last poll.
            // (and if this isn't the first fetch.)
            if (
              this.state.loadedGames === false ||
              (JSON.stringify(games) !== JSON.stringify(this.state.games))
              ) {
              this.setState({
                games: games
              }, this.setLoadedGames);
            }
          } else {
            console.error('Uh oh, something unexpected happened when fetching the data.');
          }
        } else {
          console.error(res.status, err.toString());
        }
      });
  }

  parseGames(games) {
    if (games.length === 0) {
      return [];
    }
    let parsedGames = games.map((game) => {
      return _.pick(game, [
        'id',
        'away_team_name',
        'away_win',
        'away_loss',
        'home_team_name',
        'home_win',
        'home_loss',
        'linescore',
        'status',
        'time',
        'time_zone',
        'venue'
      ]);
    });
    return parsedGames;
  }

  setLoadedGames() {
    this.setState({
      loadedGames: moment().format('x')
    });
    React.findDOMNode(this.refs.scores).scrollTop = 0;
  }

  changeDay(operation) {
    this.setState((prevState) => {
      return {selectedDay: prevState.selectedDay[operation]('1', 'days')};
    }, this.getGames);
  }

  setDayURL() {
    this.context.router.replaceWith('scoreboard', {date: this.state.selectedDay.format('YYYY-MM-DD')});
  }

  render() {
    return (
      <div id="scoreboard">
        <Day ref="day" selectedDay={this.state.selectedDay} onChangeDay={this.changeDay} />
        <Scores ref="scores" favTeam={this.state.favTeam} games={this.state.games} loadedGames={this.state.loadedGames} />
        <p className="updates">Scoreboard updates every {(this.state.pollInterval / 1000)} seconds</p>
      </div>
    );
  }

}

Scoreboard.contextTypes = {
  router: PropTypes.func
};

export default Scoreboard;
