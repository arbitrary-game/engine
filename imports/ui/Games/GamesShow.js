import React from 'react';
import {Link} from 'react-router';
import {Message, Icon} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";

import Games from "/imports/api/Games/GamesCollection"

export class GamesShowComponent extends React.Component {
  render() {
    const {games} = this.props;
    return (
      <div>
        <Message>
          <Message.Header>{'5 минут, Турецкий'}</Message.Header>
          <p>{'Экран в разработке'}</p>
        </Message>
          <Link to="/games">{'← Назад'}</Link>
      </div>
    );
  }
}

export const GamesShowContainer = createContainer(({params: {_id}}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.showById', _id));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  // const game = Games.findOne(_id).fetch();
  const game = {
    _id: "Yandex2Game",
    name: "Яндекс #2",
    ruleset: "Classic",
    maxPlayers: 5,
    players: () => ([{}, {}, {}, {}]),
    owner: () => ({
      avatarUrl: 'http://semantic-ui.com/images/avatar/small/elliot.jpg'
    })
  };
  return {
    isLoading,
    game,
  };
}, GamesShowComponent);

export default GamesShowContainer;
