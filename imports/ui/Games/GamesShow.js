import {every} from "lodash";
import {Header, Icon, List, Button, Label} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import AutoForm from "uniforms-semantic/AutoForm";
import SelectField from "uniforms-semantic/SelectField";
import AutoField from "uniforms-semantic/AutoField";
import React from "react";
import {Redirect} from "react-router";
import Games from "/imports/api/Games/GamesCollection";
import Players from "/imports/api/Players/PlayersCollection";
import Actions from "/imports/api/Actions/ActionsCollection";
import Users from "/imports/api/Users/UsersCollection";
import {GamesStart, GamesSetOpponent} from "/imports/api/Games/GamesMethods";
import {PlayersInsert} from "/imports/api/Players/PlayersMethods";
import _ from "underscore";
import {selectOpponentSchema, placeABetSchema} from "../../api/Actions/ActionsSchema";
import SubmitField from "uniforms-semantic/SubmitField";

export class GamesShowComponent extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onBackClick() {
    this.setState({goBack: true});
  }

  onOpponentSelectSubmit(opponent) {
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
      const {game, users} = this.props;
      console.log('opponent', opponent);
      GamesSetOpponent.call({gameId: game._id, opponent});
  }

  render() {
    const {game, users, actions, isLoading, joinGame, joined, isOwner, startGame, isInitiator, isOpponent} = this.props;
    console.log('game', game);
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
        {
          !joined &&
          <Button
            onClick={joinGame}
            icon="add user"
            className="marginal"
            color="violet"
            basic
            fluid
            compact
            content={'Присоединиться'}
          />
        }
        {
          joined &&
          <Label
            basic
            className="marginal"
            color="blue"
          >{'Вы присоединены к игре'}</Label>
        }
        {
          !game.isStarted && isOwner && (users.length > 2) &&
          <Button
            onClick={startGame}
            icon="game"
            className="marginal"
            color="green"
            basic
            fluid
            compact
            content={'Начать игру'}
          />
        }
        {game.isStarted &&
        <div>
          <Label basic className="marginal" color='green'>Игра началась!</Label>
          <Header size='medium'>Действия</Header>
          <List ordered>
              {actions.map(action => (
                  <List.Item key={action._id}>
                    <List.Content>
                      <List.Header>{action.playerId} {action.type} {action.amount}</List.Header>
                    </List.Content>
                  </List.Item>
              ))}
          </List>
          {isInitiator &&
            <div>
              <AutoForm
                schema={selectOpponentSchema}
                submitField={() => <SubmitField className="violet basic fluid compact" />}
                onSubmit={this.onOpponentSelectSubmit.bind(this)}
              >
                <SelectField name="opponentId" allowedValues={game.players({userId: {$ne: Meteor.userId()}}, {sort: {stash: 1, createdAt: 1}}).map(i => i.userId)}/>
                {/*<SelectField name="opponentId" options={game.players({userId: {$ne: Meteor.userId()}}, {sort: {stash: 1, createdAt: 1}}).map(i => { return {value: i.userId, label: i.userId}})}/>*/}
                <AutoField name="amount"/>
                <button type="submit">Выбрать</button>
              </AutoForm>
            </div>
          }

            {isOpponent &&
            <div>
              <AutoForm
                  schema={placeABetSchema}
                  submitField={() => <SubmitField className="violet basic fluid compact" />}
                  onSubmit={this.onOpponentSelectSubmit.bind(this)}
              >
                <AutoField name="amount"/>
                <button type="submit">Raise/Accept</button>
              </AutoForm>
            </div>
            }

          {!isInitiator && !isOpponent &&
            <Label basic className="marginal" color='green'>Bet initiator is {game.initiatorId} </Label>
          }

          {!isInitiator && !isOpponent && game.opponentId &&
            <div>
              <Label basic className="marginal" color='green'>Bet initiator is {game.initiatorId} </Label>
              <Label basic className="marginal" color='green'>Opponent is {game.opponentId} </Label>
            </div>
          }
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
  const actions = Actions.find({gameId: _id}).fetch();
  const joined = Players.find({gameId: _id, userId: Meteor.userId()}).count() > 0;
  const isOwner = game && game.ownerId == Meteor.userId();
  const isInitiator = game && game.initiatorId == Meteor.userId();
  const isOpponent = game && game.opponentId == Meteor.userId();
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
    actions,
    joined,
    joinGame,
    startGame,
    isOwner,
    isInitiator,
    isOpponent
  };
}, GamesShowComponent);

export default GamesShowContainer;
