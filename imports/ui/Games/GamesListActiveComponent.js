import React from 'react';
import {Link} from 'react-router';

export default class extends React.Component {
  render() {
    const {games} = this.props;
    return (
      <div className="game-list">
        {games.map(game => (
          <Link
            to={`/games/${game._id}`}
            key={game._id}
            title={game.name}
          >
            {game.name}
          </Link>
        ))}
      </div>
    );
  }
}
