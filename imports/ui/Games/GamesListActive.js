import React from 'react';
import {Link} from 'react-router';
import {Feed, Icon} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";

import Games from "/imports/api/Games/GamesCollection"

export class GamesListActiveComponent extends React.Component {
  render() {
    const {games} = this.props;
    return (
      <Feed className="games-feed">
        {games.map(game => (
          <Link
            to={`/games/show/${game._id}`}
            key={game._id}
            title={game.name}
          >{
            ({isActive, location, href, onClick, transition}) =>
              <Feed.Event onClick={onClick}>
                {/*<Feed.Label>*/}
                  {/*<img src={game.owner().avatarUrl} />*/}
                {/*</Feed.Label>*/}
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

export const GamesListActiveContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.active'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const games = Games.find().fetch();
  // const games = [
  //   {
  //     _id: "Yandex2Game",
  //     name: "Яндекс #2",
  //     ruleset: "Classic",
  //     maxPlayers: 5,
  //     players: () => ([{}, {}, {}, {}]),
  //     owner: () => ({
  //       avatarUrl: 'http://semantic-ui.com/images/avatar/small/elliot.jpg'
  //     })
  //   },
  //   {
  //     _id: "TopSecretGame",
  //     name: "Тестируем новые правила",
  //     ruleset: "Fixed bets",
  //     maxPlayers: 3,
  //     players: () => ([{}, {}]),
  //     owner: () => ({
  //       avatarUrl: 'http://semantic-ui.com/images/avatar/small/helen.jpg'
  //     })
  //   },
  //   {
  //     _id: "ProSeriesGame",
  //     name: "Только для профессионалов (рейтинг 500+)",
  //     ruleset: "Classic",
  //     maxPlayers: 5,
  //     players: () => ([{}, {}]),
  //     owner: () => ({
  //         avatarUrl: 'http://semantic-ui.com/images/avatar/small/jenny.jpg'
  //     })
  //   }
  // ];
  return {
    isLoading,
    games,
  };
}, GamesListActiveComponent);

export default GamesListActiveContainer;
