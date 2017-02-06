import {sortBy, clone, map, every, defaults} from "lodash";
import classnames from "classnames";
import {Item, Header, Icon, List, Button, Label, Card, Form, Input, Image} from "semantic-ui-react";
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
import ReactDOM from 'react-dom';

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

  scrollToBottom() {
    const lastMessage = ReactDOM.findDOMNode(this.refs['last-message']);

    if (lastMessage) {
      ReactDOM.findDOMNode(lastMessage).scrollIntoView();
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
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

    const footer = game.startedAt && expectations && expectations.length ? <div className="fixed-form top-divider">
        {this.renderLabel()}
        {this.renderAction()}
      </div> : "";

    return (
      <div className={game.startedAt && expectations && expectations.length ? "comments with-form" : "comments"}>
        {this.renderMessages()}
        {footer}
      </div>
    )
  }

  renderMessages() {
    const {game, messages, currentPlayerId} = this.props;
    return (
      <Card.Group itemsPerRow={1}>
        {messages.map((message, index) => {
          const isLast = messages.length == index + 1;
          const parameters = this.getMessageParameters(message);
          const headerKey = `Messages.${message.type}`;
          const header = i18n.__(headerKey, parameters);
          const headerIsPresent = (header !== headerKey);
          let text;
          if (message.type == 'Round') {
            text = this.formatRoundResult(message.result);
          } else if (message.type == 'Finish') {
            text = this.formatGameResult(message.winner);
          }
          const ref = isLast ? 'last-message' : undefined;
          return (
            <Card key={index} ref={ref}>
              {/*<Card.Avatar src='http://semantic-ui.com/images/avatar/small/matt.jpg' />*/}
              <Card.Content>
                {headerIsPresent && <Card.Header>{header}</Card.Header>}
                {text && <Card.Description>{text}</Card.Description>}
                <Card.Meta>{moment(message.createdAt).format("HH:mm")}</Card.Meta>
              </Card.Content>
            </Card>
          )
        })}
      </Card.Group>
    )
  }

  formatRoundResult(result) {
    return <List relaxed>
      {map(result, row => <List.Item>
        <Image avatar src={this.getAvatarByPlayerId(row.playerId)} />
        <List.Content>
          <List.Header>{this.getNameByPlayerId(row.playerId)}</List.Header>
          <List.Description>{row.total}</List.Description>
        </List.Content>
      </List.Item>)}
    </List>
  }

  formatGameResult(winner) {
    return <Item>
      <Item.Image src={this.getAvatarByPlayerId(winner._id)} />
      <Item.Content>
        Победитель - {this.getNameByPlayerId(winner._id)}
      </Item.Content>
    </Item>
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

    if (expectations[0].playerId !== currentPlayerId) {
      return (
        <AutoForm
          schema={clone(BetActionsSchema)}
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
            schema={clone(ChooseOpponentActionsFormSchema)}
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
            schema={clone(BetActionsSchema)}
            onValidate={function(model, error, callback) {console.log("Validate", arguments); callback(null)}}
            onChange={ (name, val) => {console.log("ASD"); this.setState({lastAmount: val})}}
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
            schema={clone(BetActionsSchema)}
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
            schema={clone(VoteActionsSchemaForMethod)}
            submitField={() => <SubmitField className="violet basic fluid compact" />}
            onSubmit={this.onVoteSelectSubmit.bind(this)}
            model={expectations[0]}
          >
            {/*Should be players*/}
            <ConnectedSelectUserFieldWithSubmit name="candidateId" placeholder={'Выберите игрока'}
              transform={this.getNameByPlayerId} allowedValues={game.players({_id: {$in: game.ruleset().getCandidateIds()}}, {
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

  getAvatarByPlayerId(playerId) {
    const player = Players.findOne(playerId);
    if (!player) debugger;
    const user = player.user({}, {fields: {"profile.avatarUrl": 1}});

    // TODO remove the stub
    return user.profile.avatarUrl || '/images/avatars/WinstonChurchill.jpg';
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


  const currentPlayer = Players.findOne({gameId: _id, userId: currentUserId});
  let currentPlayerId = currentPlayer && currentPlayer._id;

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

    // add default "Hello" message
    messages.unshift({type: "Start", createdAt: game.startedAt});

    // sort them to allow to the current player to complete his own action first
    const sortedExpectations = sortBy(expectations, expectation => expectation.playerId != currentPlayerId);

    console.log('expectations', expectations);
    console.log('messages', messages);

    data.expectations = sortedExpectations;
    data.messages = messages;
  }

  return data;
}, GamesShowComponent);

export default GamesShowContainer;
