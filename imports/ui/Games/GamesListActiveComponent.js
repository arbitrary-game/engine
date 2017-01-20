import React from 'react';
import {Link} from 'react-router';
import {Feed, Icon} from 'semantic-ui-react'

export default class extends React.Component {
  render() {
    const {games} = this.props;
    return (
      <Feed className="games-feed">
        {games.map(game => (
          <Link
            to={`/games/${game._id}`}
            key={game._id}
            title={game.name}
          >{
            ({isActive, location, href, onClick, transition}) =>
              <Feed.Event onClick={onClick}>
                <Feed.Label>
                  <img src={game.owner().avatarUrl} />
                </Feed.Label>
                <Feed.Content>
                  <Feed.Summary>
                    {game.name}
                    {/*<Feed.Date>сегодня в 18:45</Feed.Date>*/}
                  </Feed.Summary>
                  <Feed.Meta>
                    <Feed.Like>
                      <Icon name='user' />
                      &nbsp;
                      {game.players().length} из {game.maxPlayers} игроков
                    </Feed.Like>
                  </Feed.Meta>
                </Feed.Content>
              </Feed.Event>
          }
          </Link>
        ))}
      </Feed>
    );
  }
}
