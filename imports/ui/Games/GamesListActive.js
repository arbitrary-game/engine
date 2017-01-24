import React from 'react';
import {Link} from 'react-router';
import {Segment, Feed, Icon, Header, Divider} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";

import Games from "/imports/api/Games/GamesCollection"

export class GamesListActiveComponent extends React.Component {
  render() {
    const {games, isLoading} = this.props;
    return (
      <Segment vertical loading={isLoading}>
        <Feed className="games-feed">
          <Header as="h2" style={{color: '#767676'}}>Доступные игры</Header>
          {games.map((game, index) => (
            <Link
              to={`/games/show/${game._id}`}
              key={game._id}
              title={game.name}
            >{
              ({isActive, location, href, onClick, transition}) =>
                <Feed.Event onClick={onClick}>
                  <Feed.Label>
                    <img src={'//semantic-ui.com/images/avatar/small/matt.jpg'/*game.owner().avatarUrl*/} />
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
                        {game.players().count()} из {game.maxPlayers} игроков
                      </Feed.Like>
                    </Feed.Meta>
                    {/*{(index + 1 != games.length) && <Divider fitted />}*/}
                  </Feed.Content>
                </Feed.Event>
            }
            </Link>
          ))}
          {!games.length && <i>Нет доступных игр</i>}
        </Feed>
      </Segment>
    );
  }
}

export const GamesListActiveContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.active'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const openGames = Games.find({}, {sort: {createdAt: 1}}).fetch();
  const games = openGames.filter(game => game.players({userId: Meteor.userId()}).count() == 0);
  return {
    isLoading,
    games,
  };
}, GamesListActiveComponent);

export default GamesListActiveContainer;
