import React from 'react';
import {Link} from 'react-router';
import {Segment, Feed, Icon, Header, Divider} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";
import _ from 'underscore'

import Games from "/imports/api/Games/GamesCollection"
import Players from "/imports/api/Players/PlayersCollection"

export class GamesListJoinedComponent extends React.Component {
  render() {
    const {games, isLoading} = this.props;
    return (
      <Segment vertical className="top" loading={isLoading}>
        <Feed className="games-feed">
          <Header as="h2" style={{color: '#767676'}}>{'Текущие игры'}</Header>
          {games.map((game, index) => (
            <Link
              to={`/games/show/${game._id}`}
              key={game._id}
              title={game.name}
            >{
              ({isActive, location, href, onClick, transition}) =>
                <Feed.Event onClick={onClick}>
                  <Feed.Label>
                    <img src={game.owner().profile.avatarUrl} />
                  </Feed.Label>
                  <Feed.Content>
                    <Feed.Summary>
                      {game.name}
                      {/*<Feed.Date>сегодня в 18:45</Feed.Date>*/}
                    </Feed.Summary>
                    <Feed.Meta>
                      <Feed.Like>
                        <Icon name='user'/>
                        &nbsp;
                        {game.players().count()} из {game.maxPlayers} игроков
                      </Feed.Like>
                    </Feed.Meta>
                  </Feed.Content>
                </Feed.Event>
            }
            </Link>
          ))}
          {!games.length && <i>Вы не состоите в играх</i>}
        </Feed>
      </Segment>
    );
  }
}

export const GamesListJoinedContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.joined'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const players = Players.find({userId: Meteor.userId()}).fetch();
  const gameIds = _.uniq(_.pluck(players, "gameId"));
  const games = Games.find({_id: {$in: gameIds}}, {sort: {createdAt: 1}}).fetch();
  return {
    isLoading,
    games,
  };
}, GamesListJoinedComponent);

export default GamesListJoinedContainer;
