import {filter, findLastIndex, first, sortBy, clone, map, every, defaults} from "lodash";
import classnames from "classnames";
import {Progress, Item, Header, Icon, List, Button, Label, Card, Form, Input, Image, Divider, Container, Accordion} from "semantic-ui-react";
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
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import ReactDOM from 'react-dom';
import ShowAvatar from '/imports/common/ShowAvatar'
import { Session } from 'meteor/session'
import Clipboard from 'clipboard'

var noneIfNaN = function noneIfNaN(x, sessionNameToSave) {
  const res = isNaN(x) ? undefined : x
  if (sessionNameToSave){
    Session.set(sessionNameToSave, res)
  }
  return res;
};
// https://github.com/vazco/uniforms#example-cyclefield

const AmountFieldWithSubmit = ({onChange, value, decimal, errorMessage, disabled, id, max, min, name, placeholder, inputRef, sessionName}) => {
  return (
    <Form.Field>
      { errorMessage && <Label basic color='red' pointing='below'>{errorMessage}</Label>}
      <Input
        value={value}
        onChange={ event => onChange(noneIfNaN((decimal ? parseFloat : parseInt)(event.target.value), sessionName))}
        action={<Button icon='play' className="violet" disabled={disabled} size="large"/>}
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
    <Button size="large" disabled={disabled} icon='play' labelPosition='left' className="violet" style={{width: "100%"}} label={
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

  componentDidMount() {
    new Clipboard('.clipboardContent button');
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
    // remove unessesary schema fields
    delete opponent.values;
    delete opponent.schema;
    GamesSetOpponent.call({gameId: game._id, opponent});
  }

  onVoteSelectSubmit(opponent) {
    // TODO: https://trello.com/c/zOcfeLOd/13-implement-loading-state-for-gamescreate-form
    const {game} = this.props;
    // console.log('game', game);
    console.log('opponent', opponent);
    // remove unessesary schema fields
    delete opponent.values;
    delete opponent.schema;
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
    // remove last stake value
    Session.set("lastStakeValue", undefined)
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

    const onSubmit = event => {event.preventDefault()};
    const showTooltip = () => {
      const target = $('.clipboardContent');

      target.find('input').blur();
      target.attr('aria-label', i18n.__('Generic.Copied'));
      target.addClass('tooltipped tooltipped-n');

      setTimeout(() =>{
        target.removeClass('tooltipped tooltipped-n');
        target.removeAttr('aria-label');
      }, 2000);
    };

    return (
      <div className="games-show">
        {this.renderHeader("games-header fixed bottom-divider")}
        {this.renderHeader("games-header fixed-doubler bottom-divider") /* Rendering header twice to push the content down: http://stackoverflow.com/a/6414716/303694 */}
        {
          !game.startedAt &&
          <div className="members">
            <Header size='medium'>Участники</Header>
            <List>
              {game.players({}, {sort: {createdAt: 1}}).map( player => {
                const user = player.user({})
                return (
                  <List.Item key={user._id}>
                    <Image avatar src={ShowAvatar(user)} />
                    <List.Content>
                      <List.Header>{user.profile.name || 'No name'}</List.Header>
                      <List.Description>Присоединился {game && this._getJoinDate(game, user._id)}</List.Description>
                    </List.Content>
                  </List.Item>
                )
              })}
            </List>
            {users.length < game.maxPlayers && <Form onSubmit={onSubmit}>
              <Form.Field>
                <label>Пригласи друга</label>
                <Input className='clipboardContent'
                       name="clipinput"
                       icon='user plus'
                       iconPosition='left'
                       action={{ color: 'violet', icon: 'copy', 'data-clipboard-target': '.clipboardContent input', onClick: showTooltip}}
                       onClick={showTooltip}
                       defaultValue={window.location.href}
                />
              </Form.Field>
            </Form>}
            <div className="margin-top">
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
                <Button
                  icon="check"
                  className="marginal"
                  color="violet"
                  basic
                  fluid
                  disabled
                  compact
                  content={'Присоединиться'}
                />
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
    const lastRound = (_.filter(messages, (i) => i.type === 'Finish').length > 0 ) && _.filter(messages, (i) => i.type === 'Round').length
    return (
      <Card.Group itemsPerRow={1}>
        {messages.map((message, index) => {
          const isLast = messages.length == index + 1;
          const parameters = this.getMessageParameters(message, _.take(messages, index + 1));
          const headerKey = `Messages.${message.type}`;
          const header = i18n.__(headerKey, parameters);
          const headerIsPresent = (header !== headerKey);
          const avatar = message.playerId ? <Image avatar floated='left' src={this.getAvatarByPlayerId(message.playerId)} /> : "";
          let text;
          let nextRoundNumber;
          let needsNextRoundDivider = false;
          if (message.type == 'Round') {
            text = this.formatRoundResult(message.result);
            if (lastRound !== parameters.finishedRoundNumber){
              nextRoundNumber = parameters.finishedRoundNumber + 1
              needsNextRoundDivider = true
            }
          } else if (message.type == 'Finish') {
            text = this.formatGameResult(message.winner);
          } else if (message.type == 'Start'){
            nextRoundNumber = parameters.finishedRoundNumber + 1
            needsNextRoundDivider = true
          }
          const ref = isLast ? 'last-message' : undefined;
          if (needsNextRoundDivider) {
            return ([
                <Card key={index} ref={ref}>
                  <Card.Content>
                    {avatar}
                    {headerIsPresent && <Card.Header><div dangerouslySetInnerHTML={{ __html:  header}}></div></Card.Header>}
                    {text && <Card.Description>{text}</Card.Description>}
                    <Card.Meta>{moment(message.createdAt).format("HH:mm")}</Card.Meta>
                  </Card.Content>
                </Card>,
                  <div className="padded"><Divider horizontal>{i18n.__('Messages.NextRound', {nextRoundNumber})}</Divider></div>
                ]
            )
          }

          return (
              <Card key={index} ref={ref}>
                <Card.Content>
                  {avatar}
                  {headerIsPresent && <Card.Header><div dangerouslySetInnerHTML={{ __html:  header}}></div></Card.Header>}
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
      {map(result, row => {
        const hasDetails = row.prize || row.scalp || row.fix;

        // don't allow "0%" message
        const shareFactor = Math.round(row.share * 100);
        const shareText = shareFactor < 1 ? "<1" : shareFactor;

        const details = hasDetails ? <span className="round-details">(
        {row.prize ? <span>
          <Icon name='law'/>
          {this.getColoredResultNumber(row.prize)}
        </span> : ""}
        {row.scalp ? <span>
          <Icon name='cut'/>
          {this.getColoredResultNumber(row.scalp)}
        </span> : ""}
        {row.fix ? <span>
          {this.getColoredResultNumber(row.fix)}
        </span> : ""}
        )</span> : "";

        return (<List.Item key={row.playerId}>
          <Image avatar src={this.getAvatarByPlayerId(row.playerId)} />
          <List.Content>
            <List.Header>{this.getNameByPlayerId(row.playerId)} { row.winner && [<Icon name='trophy'/>, <span>Выигрывает пари</span>] }</List.Header>
            <List.Description>{row.total} {details}
            </List.Description>
            <Accordion>
              <Accordion.Title>
                <Icon name='dropdown' />
                Подробнее
              </Accordion.Title>
              <Accordion.Content className="no-top-paddings">
                <List className="no-top-paddings">
                  <List.Item icon='money' content={<span>Было денег {row.stash}</span>} />
                  <List.Item icon='like outline' content={<span>Ставка {row.bet}</span>} />
                  {row.candidateId && <List.Item icon='user' content={row.candidateId === row.playerId ? "на себя" : <span>На кандидата <b>{this.getNameByPlayerId(row.candidateId)}</b> </span>} />}
                  <List.Item icon='law' content= { row.winner != null ? ( row.winner ? [<Icon name='trophy'/>, <span>Выигрывает пари {this.getColoredResultNumber(row.prize)}</span>] : <span>Проигрывает пари {this.getColoredResultNumber(row.prize)}</span>) : 'Не участвовал в пари'} />
                  <List.Item icon='percent' content={<span>Доля в ставке {this.getColoredResultNumber(shareText)}%</span>} />
                  <List.Item icon='cut' content={<span>Скальп {this.getColoredResultNumber(row.scalp)}</span>} />
                  <List.Item icon='circle notched' content={<span>Округление {this.getColoredResultNumber(row.fix)}</span>} />
                  <List.Item icon='line graph' content={<span>Текущий счет {row.total} ({this.getColoredResultNumber(row.total - row.stash)})</span>} />
                </List>
              </Accordion.Content>
            </Accordion>
          </List.Content>
        </List.Item>
        )
      }
    )}
    </List>
  }

  getColoredResultNumber(value) {
    return value == 0 ? <span>{value}</span>: value > 0 ? <span className="win-color">+{value}</span> : <span className="lose-color">{value}</span>
  }

  formatGameResult(winner) {
    const {game} = this.props;
    const player = Players.findOne(winner._id)
    return <Item className="center">
      <Item.Image src={this.getAvatarByPlayerId(winner._id)} size="small" shape='circular' />
      <Item.Content className="win-game-content">
        <span>Игру выиграл: <b>{this.getNameByPlayerId(winner._id)}</b></span>
        <div>Выигрыш составил: <b className="win-color">{player && winner.stash - player.stash}</b></div>
        <Icon name='trophy' size='huge' color="yellow"/>
      </Item.Content>
    </Item>
  }

  renderHeader(className) {
    const {game, currentPlayerId, messages} = this.props;
    const player = Players.findOne(currentPlayerId);

    let stash = player && player.stash
    const lastRound = _.last(_.filter(messages, (i) => i.type === 'Round'));
    if (lastRound && lastRound.result){
      const currentPlayerResult = _.find(lastRound.result, i => i.playerId === currentPlayerId)
      if (currentPlayerResult && currentPlayerResult.total){
        stash = currentPlayerResult.total
      }
    }
    return (
      <div className={className}>
        <Header as="h3">
          <span>
            <Icon link name="chevron left" size="small" onClick={this.onBackClick.bind(this)} />
            {game.name}
            </span>
          {stash && <span className='ballance'>
            {stash} <Icon name='money'/>
          </span>
          }
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
    const expectation = first(expectations);
    const isOwn = expectation.playerId == currentPlayerId;

    if (!isOwn && (['Stake', 'Vote'].indexOf(expectation.type) != -1)) {
      return this.displayProgressBar();
    }

    const parameters = {playerName: this.getNameByPlayerId(expectations[0].playerId), stash: expectations[0].max}
    const message = i18n.__(`Expectations.${isOwn? "Own" : "Other"}.${expectations[0].type}`, parameters);
    return (
      <Label basic color='violet' pointing='below'><div dangerouslySetInnerHTML={{ __html:  message}}></div></Label>
    )
  }

  renderAction() {
    const {game, expectations, currentPlayerId} = this.props;

    const expectation = first(expectations);
    const {schema} = expectation;
    // save last value for stake
    if (expectation.type === "Stake" && expectation.amount){
      expectation.amount = Session.get("lastStakeValue")
    }

    const props = {
      validate: 'onSubmit',
      model: expectation,
      schema,
      onChange: () => this.setState({}) // workaround: force recalculate the form to apply updated schema from last expectation
    };

    // stub form
    if (expectation.playerId !== currentPlayerId) {
      return;
      // return (
      //   <AutoForm {...props}>
      //     <ConnectedAmountFieldWithSubmit name="amount" disabled={true} placeholder={i18n.__("Games.InputAmountPlaceholder")} />
      //   </AutoForm>
      // )
    }

    switch (expectation.type) {
      case "ChooseOpponent":
        return (
          <AutoForm onSubmit={this.onOpponentSelectSubmit.bind(this)} {...props}>
            <ConnectedSelectUserFieldWithSubmit
              name="opponentId" placeholder={i18n.__("Games.SelectPlayerPlaceholder")}
              transform={this.getNameByPlayerId} allowedValues={expectation.values} />
          </AutoForm>
        );
      case "Raise":
        return (
          <AutoForm onSubmit={this.onOpponentBetSubmit.bind(this)} {...props}>
            <ConnectedAmountFieldWithSubmit name="amount" placeholder={i18n.__("Games.InputAmountRaisePlaceholder")} />
          </AutoForm>
        );
      case "Stake":
        return (
          <AutoForm onSubmit={this.onOpponentBetSubmit.bind(this)} {...props}>
            <ConnectedAmountFieldWithSubmit name="amount" placeholder={i18n.__("Games.InputAmountBetPlaceholder")}
                                            sessionName="lastStakeValue"/>
          </AutoForm>
        );
      case "Vote":
        return (
          <AutoForm onSubmit={this.onVoteSelectSubmit.bind(this)} {...props}>
            <ConnectedSelectUserFieldWithSubmit
              name="candidateId" placeholder={i18n.__("Games.SelectPlayerVotePlaceholder")}
              transform={this.getNameByPlayerId} allowedValues={expectation.values} />
          </AutoForm>
        );
      default:
        throw new Error(`Undefined action type: ${action.type}`);
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
    // TODO correct fields
    const user = player.user({});

    // TODO remove the stub
    return ShowAvatar(user);
  }

  getMessageParameters(message, messages) {
    const finishedRoundNumber = _.filter(messages, (i) => i.type === 'Round').length
    const playerId = message.playerId;
    // Anticipating refactoring opponentId + candidateId into targetId
    const targetId = message.opponentId || message.candidateId || message.targetId;
    const player = playerId && Players.findOne(playerId).user({}, {fields: {"profile.name": 1}});
    const target = targetId && Players.findOne(targetId).user({}, {fields: {"profile.name": 1}});
    return defaults({
      playerName: player && player.profile.name,
      targetName: target && target.profile.name,
      finishedRoundNumber: finishedRoundNumber
    }, message)
  }

  displayProgressBar() {
    const {messages, expectations} = this.props;
    const expectation = first(expectations);
    const roundMessages = messages.slice(findLastIndex(messages, ['type', 'ChooseOpponent']));
    const processed = filter(roundMessages, ['type', expectation.type]).length;

    const amount = expectations.length;
    const overall = processed + amount;
    const message = i18n.__(`Expectations.Other.${expectation.type}`, {processed, overall});
    const percent = processed * 100 / (overall);
    return <Progress percent={percent} active color='violet'>
      <div dangerouslySetInnerHTML={{ __html:  message}}></div>
    </Progress>
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
  const users = Users.find({_id: {$in: userIds}}, {sort: {createdAt: 1}}).fetch();
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
