import {every} from "lodash";
import {Header, Icon, List, Button, Label, Menu, Message} from "semantic-ui-react";
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
import {ActionsInsert} from "/imports/api/Actions/ActionMethods";
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

  onOpponentBetSubmit(opponent) {
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
    const {game, maxBet} = this.props;
    console.log('maxBet', maxBet);
    if (opponent.amount > maxBet){
        ActionsInsert.call({playerId: Meteor.userId(), type: "Raise", amount: opponent.amount, gameId: game._id})
    }
    else {
        ActionsInsert.call({playerId: Meteor.userId(), type: "Bet", amount: opponent.amount, gameId: game._id})
    }
  }


  render() {
    const {game, users, actions, isLoading, joinGame, joined, isOwner,
        startGame, isInitiator, isOpponent, gameState, rounds, pendingActions} = this.props;
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
        {
          !game.isStarted && <div>
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

          </div>
        }


        {
          game.isStarted && rounds && rounds.length &&
          <Menu pagination>
            {rounds.map(round => (
              <Menu.Item key={round.name} name={round.name} >
              </Menu.Item>
            ))}
          </Menu>
        }
        {
          game.isStarted && pendingActions && pendingActions.length &&
          <Message icon>
            <Icon name='circle notched' loading />
            <Message.Content>
              <Message.Header>Wait for other players</Message.Header>
              Alice is choosing partner
            </Message.Content>
          </Message>
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
          {isInitiator && gameState && gameState === 'OPPONENT_SET' &&
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

            {isInitiator && gameState && gameState === 'INITIATOR_BET' &&
            <div>
              <AutoForm
                  schema={placeABetSchema}
                  submitField={() => <SubmitField className="violet basic fluid compact" />}
                  onSubmit={this.onOpponentBetSubmit.bind(this)}
              >
                <AutoField name="amount"/>
                <button type="submit">Raise/Accept</button>
              </AutoForm>
            </div>
            }

            {isOpponent && gameState && gameState === 'OPPONENT_BET' &&
            <div>
              <AutoForm
                  schema={placeABetSchema}
                  submitField={() => <SubmitField className="violet basic fluid compact" />}
                  onSubmit={this.onOpponentBetSubmit.bind(this)}
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
            <Label basic className="marginal" color='green'>Opponent is {game.opponentId} </Label>
          }
        </div>
        }
      </div>
    );
  }
}

const getGameState = (actions, ruleset) => {
  const rounds = [{name: "Round 1"}, {name: "Round 2"}, {name: "Round 3"}];
  const pendingActions = [{type: "Stake", playerId: "WinstonChurchillUser"}];
  return {pendingActions, rounds}
    // if (game && game.isStarted) {
    //     if (!game.initiatorId) {
    //         return 'INITIATOR_SET'
    //     } else {
    //         const initiatorRaise = game.actions({playerId: game.initiatorId, type: "Raise"}).count();
    //         if (!game.opponentId) {
    //             return 'OPPONENT_SET'
    //         } else {
    //             const opponentRaise = game.actions({playerId: game.opponentId, type: "Raise"}).count();
    //             if (game.actions({
    //                     playerId: game.initiatorId,
    //                     type: "Bet"
    //                 }, {limit: 1}).count() && game.actions({playerId: game.opponentId, type: "Bet"}, {limit: 1}).count()) {
    //                 return 'STAKING'
    //             } else if (initiatorRaise <= opponentRaise) {
    //                 return 'INITIATOR_BET'
    //             } else if (initiatorRaise > opponentRaise) {
    //                 return 'OPPONENT_BET'
    //             }
    //
    //         }
    //
    //     }
    // }
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

  const maxBetQuery = game && game.actions({type: "Raise"}, {sort: {amount: -1}, limit:1}).fetch();

  const maxBet = maxBetQuery && maxBetQuery.length && maxBetQuery[0].amount;

  let gameState;
  // const gameState = getGameState(game);
  console.log('gameState', gameState);

  const {pendingActions, rounds} = getGameState(actions);


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
    isOpponent,
    gameState,
    pendingActions,
    rounds
  };
}, GamesShowComponent);

export default GamesShowContainer;
