import {every, defaults} from "lodash";
import classnames from "classnames";
import {Header, Icon, List, Button, Label, Card, Form, Input, Image} from "semantic-ui-react";
import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import i18n from 'meteor/universe:i18n';
import AutoForm from "uniforms-semantic/AutoForm";
import React from "react";
import {Redirect} from "react-router";
import moment from "moment";
import Games from "/imports/api/Games/GamesCollection";
import Players from "/imports/api/Players/PlayersCollection";
import Actions from "/imports/api/Actions/ActionsCollection";
import Users from "/imports/api/Users/UsersCollection";
import {GamesStart, GamesSetOpponent, GamesVote} from "/imports/api/Games/GamesMethods";
import {PlayersInsert} from "/imports/api/Players/PlayersMethods";
import {ActionsInsert} from "/imports/api/Actions/ActionMethods";
import {ChooseOpponentActionsSchema, BetActionsSchema, ChooseOpponentActionsFormSchema, VoteActionsSchemaForMethod} from "../../api/Actions/ActionsSchema";
import SubmitField from "uniforms-semantic/SubmitField";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";


var noneIfNaN = function noneIfNaN(x) {
  return isNaN(x) ? undefined : x;
};
// https://github.com/vazco/uniforms#example-cyclefield

const AmountFieldWithSubmit = ({onChange, value, decimal, errorMessage, disabled, id, max, min, name, placeholder, inputRef}) => {
  return (
    <Form.Field>
      { errorMessage && <Label basic color='red' pointing='below'>{errorMessage}</Label>}
      <Input
        value={value}
        onChange={ event => onChange(noneIfNaN((decimal ? parseFloat : parseInt)(event.target.value)))}
        action={<Button icon='play' className="violet" />}
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        name={name}
        placeholder={placeholder}
        ref={inputRef}
        step={decimal ? 0.01 : 1}
        type='number'
      />
    </Form.Field>
  )
};

export const ConnectedAmountFieldWithSubmit = connectField(AmountFieldWithSubmit);


const renderSelect = ({
    allowedValues,
    disabled,
    id,
    inputRef,
    label,
    name,
    onChange,
    placeholder,
    required,
    transform,
    value
  }) =>
    <select
      disabled={disabled}
      id={id}
      name={name}
      onChange={event => onChange(event.target.value)}
      ref={inputRef}
      value={value}
    >
      {(!!placeholder || !required) && (
        <option value="" disabled={required} hidden={required}>
          {placeholder ? placeholder : label}
        </option>
      )}
      {allowedValues.map(value =>
        <option key={value} value={value}>
          {transform ? transform(value) : value}
        </option>
      )}
    </select>
  ;

const SelectUserFieldWithSubmit = ({
    allowedValues,
    checkboxes,
    className,
    disabled,
    error,
    errorMessage,
    fieldType,
    id,
    inputRef,
    label,
    name,
    onChange,
    placeholder,
    required,
    showInlineError,
    transform,
    value,
    ...props
  }) =>
    <Button icon='play' labelPosition='left' className="violet" style={{width: "100%"}} label={
      <section style={{marginBottom: "0px", width: "100%"}} className={classnames({
        disabled,
        error,
        required
      }, className, 'field')} {...filterDOMProps(props)}>
        {/* eslint-disable max-len */}
        {checkboxes || fieldType === Array
          ? renderCheckboxes({allowedValues, disabled, id, name, onChange, transform, value, fieldType})
          : renderSelect({
            allowedValues,
            disabled,
            id,
            name,
            onChange,
            transform,
            value,
            inputRef,
            label,
            placeholder,
            required
          })
        }
        {/* eslint-enable */}
        {/*{!!(errorMessage && showInlineError) && (*/}
        {/*<section className="ui red basic pointing label">*/}
        {/*{errorMessage}*/}
        {/*</section>*/}
        {/*)}*/}
      </section>} />
  ;

export const ConnectedSelectUserFieldWithSubmit = connectField(SelectUserFieldWithSubmit);

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
    // console.log('game', game);
    console.log('opponent', opponent);
    GamesSetOpponent.call({gameId: game._id, opponent});
  }

  onVoteSelectSubmit(opponent) {
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
    const {game} = this.props;
    // console.log('game', game);
    console.log('opponent', opponent);
    GamesVote.call({gameId: game._id, opponent});
  }

  onOpponentBetSubmit(opponent) {
    console.log('opponent', opponent);
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
    // const {game, maxBet} = this.props;
    // console.log('maxBet', maxBet);
    // if (opponent.amount > maxBet) {
    const {currentPlayerId, game} = this.props;
    ActionsInsert.call({playerId: currentPlayerId, type: opponent.type, amount: opponent.amount, gameId: game._id})
    // }
    // else {
    //   ActionsInsert.call({playerId: currentUserId, type: "Bet", amount: opponent.amount, gameId: game._id})
    // }
  }

  _getJoinDate(game, userId){
    const player = game.players({userId}).fetch()
    if (player.length && player[0].createdAt){
      return moment(player[0].createdAt).fromNow()
    }
  }

  render() {
    const {
      isLoading, game, users, joinGame, joined, isOwner,
      startGame, messages, expectations
    } = this.props;

    if (this.state.goBack) {
      return <Redirect to="/" />
    }

    if (isLoading) {
      return (
        <div className="games-show">
          <div className="loading">{'Игра загружается...'}</div>
        </div>
      )
    }

    return (
      <div className="games-show">
        {this.renderHeader("games-header fixed bottom-divider")}
        {this.renderHeader("games-header fixed-doubler bottom-divider") /* Rendering header twice to push the content down: http://stackoverflow.com/a/6414716/303694 */}
        {
          !game.startedAt &&
          <div className="members">
            <Header size='medium'>Участники</Header>
            <List>
              {users.map(user => (
                <List.Item key={user._id}>
                  <Image avatar src={(user.profile && user.profile.avatarUrl)  || "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"} />
                  <List.Content>
                    <List.Header>{user.profile.name || 'No name'}</List.Header>
                    <List.Description>Присоединился {game && this._getJoinDate(game, user._id)}</List.Description>
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
              >{'Вы присоединились к игре'}</Label>
            }
            {
              // TODO: move the "users.length > 2" check into Ruleset
              !game.startedAt && isOwner && (users.length > 2) &&
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
          game.startedAt &&
          this.renderChat()
        }
      </div>
    );
  }

  renderChat() {
    const {game, expectations} = this.props;
    return (
      <div className={game.startedAt && expectations && expectations.length ? "comments with-form" : "comments"}>
        {this.renderMessages()}
        {
          game.startedAt && expectations && expectations.length &&
          <div className="fixed-form top-divider">
            {this.renderLabel()}
            {this.renderAction()}
          </div>
        }
      </div>
    )
  }

  renderMessages() {
    const {game, messages, currentPlayerId} = this.props;
    return (
      <Card.Group itemsPerRow={1}>
        {messages.map((message, index) => {
          const parameters = this.getMessageParameters(message);
          const headerKey = `Messages.${message.type}`;
          const header = i18n.__(headerKey, parameters);
          const headerIsPresent = (header !== headerKey);
          {/*const textKey = `Messages.${message.type}.Text`;*/}
          {/*const text = i18n.__(textKey, message);*/}
          {/*const textIsPresent = (text !== textKey);*/}
          return (
            <Card key={index}>
              {/*<Card.Avatar src='http://semantic-ui.com/images/avatar/small/matt.jpg' />*/}
              <Card.Content>
                {headerIsPresent && <Card.Header>{header}</Card.Header>}
                <Card.Meta>{moment(message.createdAt).format("HH:mm")}</Card.Meta>
                {/*{textIsPresent && <Card.Description>{text}</Card.Description>}*/}
                {/*<Card.Actions>*/}
                {/*<Card.Action>Reply</Card.Action>*/}
                {/*</Card.Actions>*/}
              </Card.Content>
            </Card>
          )
        })}
      </Card.Group>
    )
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
        {/*game.startedAt && messages && messages.length &&*/}
        {/*<Menu pagination>*/}
        {/*{messages.map((round, index) => (*/}
        {/*<Menu.Item key={index++} name={"Round" + index++}>*/}
        {/*</Menu.Item>*/}
        {/*))}*/}
        {/*</Menu>*/}
        {/*}*/}
      </div>
    )
  }

  renderLabel() {
    const {expectations, currentPlayerId} = this.props;
    const isOwn = expectations[0].playerId === currentPlayerId;
    const parameters = {playerName: this.getNameByPlayerId(expectations[0].playerId)}
    const message = i18n.__(`Expectations.${isOwn? "Own" : "Other"}.${expectations[0].type}`, parameters);
    return (
      <Label basic color='violet' pointing='below'>{message}</Label>
    )
  }

  renderAction() {
    const {game, expectations, currentPlayerId} = this.props;
    console.log("expectations", expectations);
    //TOOD execute own expectations first
    if (expectations[0].playerId !== currentPlayerId) {
      return (
        <AutoForm
          schema={BetActionsSchema}
          onChange={ (name, val) => this.setState({lastAmount: val})}
          onSubmit={this.onOpponentBetSubmit.bind(this)}
          model={expectations[0]}
        >
          <ConnectedAmountFieldWithSubmit name="amount" disabled={true} placeholder="Input stake" />
        </AutoForm>
      )
    }

    switch (expectations[0].type) {
      case "ChooseOpponent":
        return (
          <AutoForm
            schema={ChooseOpponentActionsFormSchema}
            submitField={() => <SubmitField className="violet basic fluid compact" />}
            onSubmit={this.onOpponentSelectSubmit.bind(this)}
            model={expectations[0]}
          >
            <ConnectedSelectUserFieldWithSubmit
              name="opponentId" placeholder={'Выберите игрока'}
              transform={this.getNameByPlayerId} allowedValues={game.players({_id: {$ne: currentPlayerId}}, {
              sort: {
                stash: 1,
                createdAt: 1
              }
            }).map(i => i._id)} />
          </AutoForm>
        );
        break;
      case "Raise":
        return (
          <AutoForm
            schema={BetActionsSchema}
            onChange={ (name, val) => this.setState({lastAmount: val})}
            onSubmit={this.onOpponentBetSubmit.bind(this)}
            model={expectations[0]}
          >
            <ConnectedAmountFieldWithSubmit name="amount" placeholder="Input amount" />
          </AutoForm>
        )
        break;
      case "Stake":
        return (
          <AutoForm
            schema={BetActionsSchema}
            onChange={ (name, val) => this.setState({lastAmount: val})}
            onSubmit={this.onOpponentBetSubmit.bind(this)}
            model={expectations[0]}
          >
            <ConnectedAmountFieldWithSubmit name="amount" placeholder="Input stake" />
          </AutoForm>
        )
        break;
      case "Vote":
        // TODO add correct logic for this form
        return (
          <AutoForm
            schema={VoteActionsSchemaForMethod}
            submitField={() => <SubmitField className="violet basic fluid compact" />}
            onSubmit={this.onVoteSelectSubmit.bind(this)}
            model={expectations[0]}
          >
            {/*Should be players*/}
            <ConnectedSelectUserFieldWithSubmit name="candidateId" placeholder={'Выберите игрока'}
              transform={this.getNameByPlayerId} allowedValues={game.players({_id: {$in: game.ruleset().getPlayersIds()}}, {
              sort: {
                stash: 1,
                createdAt: 1
              }
            }).map(i => i._id)} />
          </AutoForm>
        );
        break;
      default:
        throw new Error(`Undefined action type: ${action.type}`);
        break;
    }
  }

  getNameByPlayerId(playerId) {
    const player = Players.findOne(playerId);
    if (!player) debugger;
    const user = player.user({}, {fields: {"profile.name": 1}});
    return user.profile.name;
  }

  getMessageParameters(message) {
    const playerId = message.playerId;
    // Anticipating refactoring opponentId + candidateId into targetId
    const targetId = message.opponentId || message.candidateId || message.targetId;
    const player = playerId && Players.findOne(playerId).user({}, {fields: {"profile.name": 1}});
    const target = targetId && Players.findOne(targetId).user({}, {fields: {"profile.name": 1}});
    return defaults({
      playerName: player && player.profile.name,
      targetName: target && target.profile.name,
    }, message)
  }
}

export const GamesShowContainer = createContainer(({params: {_id}}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Games.showById', _id));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const currentUserId = Meteor.userId();
  const game = Games.findOne(_id);
  const players = Players.find({gameId: _id}).fetch();
  const userIds = players.map(player => player.userId);
  const users = Users.find({_id: {$in: userIds}}).fetch();
  const actions = Actions.find({gameId: _id}).fetch();
  const joined = Players.find({gameId: _id, userId: currentUserId}).count() > 0;
  const isOwner = game && game.ownerId === currentUserId;
  const joinGame = () => PlayersInsert.call({gameId: _id});
  const startGame = () => GamesStart.call({gameId: _id});


  const currentPlayerQuery = Players.find({gameId: _id, userId: currentUserId}).fetch();
  let currentPlayerId;
  if (currentPlayerQuery.length) {
    currentPlayerId = currentPlayerQuery[0]._id
  }

  const maxBetQuery = game && game.actions({type: "Raise"}, {sort: {amount: -1}, limit: 1}).fetch();

  const maxBet = maxBetQuery && maxBetQuery.length && maxBetQuery[0].amount;

  let data = {
    isLoading,
    currentUserId,
    currentPlayerId,
    game,
    users,
    actions,
    joined,
    joinGame,
    startGame,
    isOwner,
  };

  if (!isLoading && game && game.startedAt) {
    const ruleset = game.ruleset();
    /* <DEBUG> */
    const {expectations, messages} = ruleset.getState();
    console.log('messages', messages);
    messages.unshift({type: "Start", createdAt: game.startedAt});
    // const expectations = [{type: "ChooseOpponent", playerId: "WinstonChurchillUser"}];
    // const messages = [{name: "Round 1"}, {name: "Round 2"}, {name: "Round 3"}];
    /* </DEBUG> */
    data.expectations = expectations;
    data.messages = messages;
  }

  return data;
}, GamesShowComponent);

export default GamesShowContainer;
