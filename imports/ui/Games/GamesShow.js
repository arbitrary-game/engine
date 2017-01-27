import {every} from "lodash";
import {Header, Icon, List, Button, Label, Message, Comment, Form, Input} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import AutoForm from "uniforms-semantic/AutoForm";
import ValidatedForm from "uniforms-semantic/ValidatedForm";
import SelectField from "uniforms-semantic/SelectField";
import ErrorsField from "uniforms-semantic/ErrorsField";
import React from "react";
import {Redirect} from "react-router";
import Games from "/imports/api/Games/GamesCollection";
import Players from "/imports/api/Players/PlayersCollection";
import Actions from "/imports/api/Actions/ActionsCollection";
import Users from "/imports/api/Users/UsersCollection";
import {GamesStart, GamesSetOpponent} from "/imports/api/Games/GamesMethods";
import {PlayersInsert} from "/imports/api/Players/PlayersMethods";
import {ActionsInsert} from "/imports/api/Actions/ActionMethods";
import {ChooseOpponentActionsSchema, BetActionsSchema} from "../../api/Actions/ActionsSchema";
import SubmitField from "uniforms-semantic/SubmitField";
import AutoField from "uniforms-semantic/AutoField";

import connectField from 'uniforms/connectField';


var noneIfNaN = function noneIfNaN(x) {
  return isNaN(x) ? undefined : x;
};
// https://github.com/vazco/uniforms#example-cyclefield

const Amount = ({onChange, value, decimal, errorMessage}) => {
  return (<Form.Field>
    { errorMessage &&      <Label basic color='red' pointing='below'>{errorMessage}</Label>}
    <Input placeholder='Amount' value={value}
           onChange={ event =>  onChange(noneIfNaN((decimal ? parseFloat : parseInt)(event.target.value)))}
           action={<Button icon='play'/>}
    />
  </Form.Field>)
  }
  ;

export const ConnectedField = connectField(Amount);

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
    const {game} = this.props;
    console.log('game', game);
    console.log('opponent', opponent);
    GamesSetOpponent.call({gameId: game._id, opponent});
  }

  onOpponentBetSubmit(opponent) {
    console.log('opponent', opponent);
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
    // const {game, maxBet} = this.props;
    // console.log('maxBet', maxBet);
    // if (opponent.amount > maxBet) {
    //   ActionsInsert.call({playerId: Meteor.userId(), type: "Raise", amount: opponent.amount, gameId: game._id})
    // }
    // else {
    //   ActionsInsert.call({playerId: Meteor.userId(), type: "Bet", amount: opponent.amount, gameId: game._id})
    // }
  }


  renderPlayerActionHeader(pendingAction) {
    let header;
    switch (pendingAction.type) {
      case "ChooseOpponent":
        header = 'Выберите оппонента';
        break;
      case "Raise":
        header = 'Place your bet';
        break;
      case "Stake":
        header = 'Place your stake';
        break;
      case "Vote":
        header = 'Place your vote';
        break;
      default:
        throw new Error(`Undefined action type: ${action.type}`);
        break;
    }
    return header
  }

  renderCurrentPlayerActionBody(pendingAction) {
    let header;
    // switch (type) {
    //   case "ChooseOpponent":
    //     header = 'Please, select on opponent';
    //     break;
    //   case "Raise":
    //     header = 'Please, place your bet or raise';
    //     break;
    //   case "Stake":
    //     header = 'Please, place your stake';
    //     break;
    //   case "Vote":
    //     header = 'Please, place your vote';
    //     break;
    //   default:
    //     throw new Error(`Undefined action type: ${action.type}`);
    //     break;
    // }
    return header
  }

  renderOtherPlayerActionHeader(pendingAction) {
    let header;
    const playerName = this.getNameByPlayerId(pendingAction.playerId);
    switch (pendingAction.type) {
      case "ChooseOpponent":
        header = `${playerName} выбирает оппонента...`;
        break;
      case "Raise":
        header = `Wait for ${playerName} to bet`;
        break;
      case "Stake":
        header = `Wait for ${playerName} to stake`;
        break;
      case "Vote":
        header = `Wait for ${playerName} to vote`;
        break;
      default:
        throw new Error(`Undefined action type: ${action.type}`);
        break;
    }
    return header;
  }

  renderOtherPlayerActionBody(pendingAction) {

  }

  renderAction(expectations) {
    const {game} = this.props;

    switch (expectations[0].type) {
      case "ChooseOpponent":
        return (              <AutoForm
            schema={ChooseOpponentActionsSchema}
            submitField={() => <SubmitField className="violet basic fluid compact" />}
            onSubmit={this.onOpponentSelectSubmit.bind(this)}
            model={expectations[0]}
          >
            <SelectField name="opponentId" transform={this.getNameByPlayerId} allowedValues={game.players({userId: {$ne: Meteor.userId()}}, {
              sort: {
                stash: 1,
                createdAt: 1
              }
            }).map(i => i._id)} />
            <ErrorsField />
            <button className="ui violet basic compact fluid button marginal">Выбрать</button>
          </AutoForm>
        )
        break;
      case "Raise":
        return (
          <AutoForm
            schema={BetActionsSchema}
            onChange={ (name, val) => this.setState({lastAmount: val})}
            onSubmit={this.onOpponentBetSubmit.bind(this)}
            model={expectations[0]}
          >
              <ConnectedField name="amount"/>
              {/*<Form.Field>*/}
                {/*<Label basic color='red' pointing='below'>Please enter a value</Label>*/}
                {/*<Input placeholder='Amount' action={<Button icon='play' />}/>*/}
              {/*</Form.Field>*/}
            {/*<AutoField name="amount"/>*/}
            {/*<ErrorsField />*/}
            {/*<button className="ui violet basic compact fluid button marginal">Raise/Accept</button>*/}
          </AutoForm>
        )
        break;
      case "Stake":
        header = `Wait for ${playerName} to stake`;
        break;
      case "Vote":
        header = `Wait for ${playerName} to vote`;
        break;
      default:
        throw new Error(`Undefined action type: ${action.type}`);
        break;
    }
  }

  render() {
    const {
      game, users, actions, isLoading, joinGame, joined, isOwner,
      startGame, isInitiator, isOpponent, rounds, expectations
    } = this.props;

    if (this.state.goBack) {
      return <Redirect to="/" />
    }

    if (isLoading) {
      return (
        <div>
          <span>{'Игра загружается...'}</span>
        </div>
      )
    }

    return (
      <div>
        {this.renderHeader("games-header fixed")}
        {this.renderHeader("games-header fixed-doubler") /* Rendering header twice to push the content down: http://stackoverflow.com/a/6414716/303694 */}
        {
          !game.isStarted &&
          <div>
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
              // TODO: move the "users.length > 2" check into Ruleset
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
          game.isStarted &&
          <div className={game.isStarted && expectations && expectations.length ? "comments-with-margin-and-notice" : "comments-with-margin"}>
            {/*<Label basic className="marginal" color='green'>Игра началась!</Label>*/}
            <Comment.Group>
              {actions.map(action => (
                <Comment key={action._id} className={action.playerId === Meteor.userId() ? "owned-by-me" : "user"}>
                  {/*<Comment.Avatar src='http://semantic-ui.com/images/avatar/small/matt.jpg' />*/}
                  <Comment.Content>
                    <Comment.Author as='a'>{action.playerId}</Comment.Author>
                    <Comment.Metadata>
                      <div>Today at 5:42PM</div>
                    </Comment.Metadata>
                    <Comment.Text>{action.message} {action.type} {action.amount}</Comment.Text>
                    {/*<Comment.Actions>*/}
                    {/*<Comment.Action>Reply</Comment.Action>*/}
                    {/*</Comment.Actions>*/}
                  </Comment.Content>
                </Comment>
              ))}
            </Comment.Group>
            {game.isStarted && expectations && expectations.length && expectations[0].playerId === Meteor.userId() &&
            <div className="fixed-form">
              {this.renderAction(expectations)}
            </div>
            }
            {/*{!isInitiator && !isOpponent &&*/}
            {/*<Label basic className="marginal" color='green'>Bet initiator is {game.initiatorId} </Label>*/}
            {/*}*/}
            {/*{!isInitiator && !isOpponent && game.opponentId &&*/}
            {/*<Label basic className="marginal" color='green'>Opponent is {game.opponentId} </Label>*/}
            {/*}*/}
          </div>
        }
      </div>
    );
  }

  renderHeader(className) {
    const {game, expectations} = this.props;
    return (
      <div className={className}>
        <Header as="h3">
          <Icon link name="chevron left" size="small" onClick={this.onBackClick.bind(this)} />
          {game.name}
        </Header>
        {/*<p>{game.name}</p>*/}
        {/*{*/}
        {/*game.isStarted && rounds && rounds.length &&*/}
        {/*<Menu pagination>*/}
        {/*{rounds.map((round, index) => (*/}
        {/*<Menu.Item key={index++} name={"Round" + index++}>*/}
        {/*</Menu.Item>*/}
        {/*))}*/}
        {/*</Menu>*/}
        {/*}*/}
        {
          game.isStarted && expectations.length &&
          this.renderExpectations(expectations)
        }
      </div>
    )
  }

  renderExpectations(expectations) {
    return (
      <Message>
        { expectations[0].playerId !== Meteor.userId() &&
        <Message.Content>
          <Message.Header>{this.renderOtherPlayerActionHeader(expectations[0])}</Message.Header>
          {this.renderOtherPlayerActionBody(expectations[0])}
        </Message.Content>
        }
        { expectations[0].playerId === Meteor.userId() &&
        <Message.Content>
          <Message.Header>{this.renderPlayerActionHeader(expectations[0])}</Message.Header>
          {this.renderCurrentPlayerActionBody(expectations[0])}
        </Message.Content>
        }
      </Message>
    )
  }

  getNameByPlayerId(playerId) {
    return Players.findOne(playerId).user({}, {fields: {"profile.name": 1}}).profile.name;
  }
}

export const GamesShowContainer = createContainer(({params: {_id}}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.showById', _id));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const game = Games.findOne(_id);
  const players = Players.find({gameId: _id}).fetch();
  const userIds = players.map(player => player.userId);
  const users = Users.find({_id: {$in: userIds}}).fetch();
  const actions = Actions.find({gameId: _id}).fetch();
  const joined = Players.find({gameId: _id, userId: Meteor.userId()}).count() > 0;
  const isOwner = game && game.ownerId == Meteor.userId();
  const isInitiator = game && game.initiatorId == Meteor.userId();
  const isOpponent = game && game.opponentId == Meteor.userId();
  const joinGame = () => PlayersInsert.call({gameId: _id});
  const startGame = () => GamesStart.call({gameId: _id});

  const maxBetQuery = game && game.actions({type: "Raise"}, {sort: {amount: -1}, limit: 1}).fetch();

  const maxBet = maxBetQuery && maxBetQuery.length && maxBetQuery[0].amount;

  let data = {
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

  if (game) {
    const ruleset = game.ruleset();
    /* <DEBUG> */
    const {expectations, messages} = ruleset.getState();
    // const expectations = [{type: "ChooseOpponent", playerId: "WinstonChurchillUser"}];
    // const rounds = [{name: "Round 1"}, {name: "Round 2"}, {name: "Round 3"}];
    /* </DEBUG> */
    data.expectations = expectations;
    data.rounds = messages;
  }

  return data;
}, GamesShowComponent);

export default GamesShowContainer;
