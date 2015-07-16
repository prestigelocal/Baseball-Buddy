import React, { Component } from 'react';
import _ from 'lodash';
import Game from './Game.js';

class Scores extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    // If no games, or games haven't been loaded yet
    // display a message instead of a set of Games
    if (this.props.games.length === 0) {
      return (
        <div id="scores">
          <div className="scores-message">
            {this.props.loadedGames !== false ? 'No games today' : 'Loading games...'}
          </div>
        </div>
      );
    }

    // Move any game involving our favourite team
    // to the first position in the array
    let favTeam = this.props.favTeam;
    let games = _.sortBy(this.props.games, (n) => {
      return !(n.home_team_name === favTeam || n.away_team_name === favTeam);
    });

    return (
      <div id="scores">
        {games.map((game) => {
          return <Game key={game.id} {...game} />;
        })}
      </div>
    );
  }

}

export default Scores;
