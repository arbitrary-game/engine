import React from "react";
import {Header, Icon, List, Button, Label} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {Redirect} from "react-router";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";
import Games from "/imports/api/Games/GamesCollection";
import Players from "/imports/api/Players/PlayersCollection";
import Users from "/imports/api/Users/UsersCollection";
import {GamesStart} from "/imports/api/Games/GamesMethods";
import {PlayersInsert} from "/imports/api/Players/PlayersMethods";
import _ from "underscore"

export class GamesShowComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onBackClick() {
    this.setState({goBack: true});
  }

  render() {
    const {game, users, isLoading, joinGame, joined, isOwner, startGame} = this.props;

    if (this.state.goBack) {
      return <Redirect to="/" />
    }

    if (isLoading) {
      return <div>
        <span>Game is Loading...</span>
      </div>
    }

    return (
      <div>
        <Header as="h3">
          <Icon link name="chevron left" size="small" onClick={this.onBackClick.bind(this)} />
          {game.name}
        </Header>
        <Header size='medium'>Участники</Header>
        <List ordered>
        {users.map(user => (
          <List.Item key={user._id}>
            <List.Content>
              <List.Header>{user.profile.name}</List.Header>
            </List.Content>
          </List.Item>
        ))}
        </List>
        {!joined && <Button
          onClick={joinGame}
          icon="add user"
          className="marginal"
          color="violet"
          basic
          fluid
          compact
          content={'Присоединиться'}
        />}
        {joined && <Label basic className="marginal" color='blue'>Вы присоединены к игре</Label>}
        {!game.isStarted && isOwner && (users.length > 2) && <Button
          onClick={startGame}
          icon="game"
          className="marginal"
          color="green"
          basic
          fluid
          compact
          content={'Начать игру'}
        />}
        {game.isStarted &&
          <div>
            <Label basic className="marginal" color='green'>Игра началась!</Label>
            <Label basic className="marginal" color='green'>Bet initiator is </Label>
          </div>
        }
      </div>
    );
  }
}

export const GamesShowContainer = createContainer(({params: {_id}}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.showById', _id));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const game = Games.findOne(_id);
  const players = Players.find({gameId: _id}).fetch();
  const userIds = _.pluck(players, "userId");
  const users = Users.find({_id: {$in: userIds}}).fetch();
  const joined = Players.find({gameId: _id, userId: Meteor.userId()}).count() > 0;
  const isOwner = game && game.ownerId == Meteor.userId();
  const joinGame = () => PlayersInsert.call({gameId: _id});
  const startGame = () => GamesStart.call({gameId: _id});

  // const game = {
  //   _id: "Yandex2Game",
  //   name: "Яндекс #2",
  //   ruleset: "Classic",
  //   maxPlayers: 5,
  //   players: () => ([{}, {}, {}, {}]),
  //   owner: () => ({
  //     avatarUrl: 'http://semantic-ui.com/images/avatar/small/elliot.jpg'
  //   })
  // };
  return {
    isLoading,
    game,
    users,
    joined,
    joinGame,
    startGame,
    isOwner
  };
}, GamesShowComponent);

export default GamesShowContainer;
