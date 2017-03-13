import {without, keys, filter, find, findLast, findLastIndex, first, sortBy, clone, map, every, defaults} from "lodash";
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
import {ActionsCreateSchema} from "/imports/api/Actions/ActionsSchema";
import Users from "/imports/api/Users/UsersCollection";
import {GamesStart} from "/imports/api/Games/GamesMethods";
import {PlayersInsert} from "/imports/api/Players/PlayersMethods";
import {ActionsInsert, ActionsKick, ActionsLeave} from "/imports/api/Actions/ActionMethods";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import ReactDOM from 'react-dom';
import ShowAvatar from '/imports/common/ShowAvatar';
import { Session } from 'meteor/session';
import Clipboard from 'clipboard';
import PlayerProfile from './PlayerProfile';
import PlayerList from './PlayerList';

const noneIfNaN = function noneIfNaN(x, sessionNameToSave) {
  console.log('noneIfNaN', arguments);
  const res = isNaN(x) ? undefined : x;
  if (sessionNameToSave) {
    Session.set(sessionNameToSave, res);
  }
  return res;
};
// https://github.com/vazco/uniforms#example-cyclefield

const AmountFieldWithSubmit = ({onChange, value, decimal, errorMessage, disabled, id, max, min, name, placeholder, inputRef, sessionName}) => (
  <Form.Field>
    { errorMessage && <Label basic color="red" pointing="below">{errorMessage}</Label>}
    <Input
      value={value}
      onChange={event => onChange(noneIfNaN((decimal ? parseFloat : parseInt)(event.target.value), sessionName))}
      action={<Button icon="play" className="violet" disabled={disabled} size="large" />}
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      name={name}
      placeholder={placeholder}
      ref={inputRef}
      step={decimal ? 0.01 : 1}
      type="number"
    />
  </Form.Field>
  );

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
    value,
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
        </option>,
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
    <Button
      size="large" disabled={disabled} icon="play" labelPosition="left" className="violet" style={{width: "100%"}} label={
        <section
          style={{marginBottom: "0px", width: "100%"}} className={classnames({
            disabled,
            error,
            required,
          }, className, 'field')} {...filterDOMProps(props)}
        >
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
            required,
          })
        }
        </section>}
    />
  ;

const SelectBooleanButtons = ({onChange}) =>
  <Button.Group fluid>
    <Button onClick={() => onChange(false)}>{i18n.__("Games.Kick.Cancel")}</Button>
    <Button onClick={() => onChange(true)} negative>{i18n.__("Games.Kick.Kick")}</Button>
  </Button.Group>;

export const ConnectedSelectUserFieldWithSubmit = connectField(SelectUserFieldWithSubmit);
export const ConnectedSelectBooleanButtons = connectField(SelectBooleanButtons);

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

  onActionSubmit(data) {
    const { game } = this.props;

    // enrich each action with current Game id
    const enriched = Object.assign(data, {gameId: game._id});

    // clear from the rest data
    const cleaned = ActionsCreateSchema.clean(enriched);

    ActionsInsert.call(cleaned);
  }

  onActionAmountSubmit(data) {
    this.onActionSubmit(data);

    // clear the last stake
    Session.set("lastStakeValue", undefined);
  }

  kickPlayer(opponentId) {
    const { game } = this.props;

    const data = { opponentId };

    // enrich each action with current Game id
    const enriched = Object.assign(data, { gameId: game._id });

    ActionsKick.call(enriched);
  }

  leaveGame() {
    const { game } = this.props;

    const data = { gameId: game._id };

    ActionsLeave.call(data);
  }

  _getJoinDate(game, userId) {
    const player = game.players({userId}).fetch();
    if (player.length && player[0].createdAt) {
      return moment(player[0].createdAt).fromNow();
    }
  }

  render() {
    const {
      isLoading, game, users, joinGame, joined, isOwner,
      startGame, messages, expectations,
    } = this.props;

    if (this.state.goBack) {
      return <Redirect to="/" />;
    }

    if (isLoading) {
      return (
        <div className="games-show">
          <div className="loading">{'Игра загружается...'}</div>
        </div>
      );
    } else if (!game) {
      return (
        <div className="games-show">
          <div className="game-not-found">{'Игра не найдена ;('}</div>
        </div>
      );
    }

    const onSubmit = (event) => { event.preventDefault(); };
    const showTooltip = () => {
      const target = $('.clipboardContent');

      target.find('input').blur();
      target.attr('aria-label', i18n.__('Generic.Copied'));
      target.addClass('tooltipped tooltipped-n');

      setTimeout(() => {
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
            <Header size="medium">Участники</Header>
            <List>
              {game.players({}, {sort: {createdAt: 1}}).map((player) => {
                const user = player.user({});
                return (
                  <List.Item key={user._id}>
                    <Image avatar src={ShowAvatar(user)} />
                    <List.Content>
                      <List.Header>{user.profile.name || 'No name'}</List.Header>
                      <List.Description>Присоединился {game && this._getJoinDate(game, user._id)}</List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
            {users.length < game.maxPlayers && <Form onSubmit={onSubmit}>
              <Form.Field>
                <label>Пригласи друга</label>
                <Input
                  className="clipboardContent"
                  name="clipinput"
                  icon="user plus"
                  iconPosition="left"
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
        { this.state.topBar == 'profile' && this.renderProfile(this.state.displayedPlayer) }
        { this.state.topBar == 'players' && this.renderPlayerList() }
        { game.startedAt && this.renderChat() }
      </div>
    );
  }

  getPlayerCurrentBalance(playerId) {
    const {messages} = this.props;

    const results = findLast(messages, message => message.type == 'Leave' || message.type == 'Round');
    if (results) {
      const player = find(results.result, ["playerId", playerId]);
      if (player) {
        return player.stash;
      } else {
        return 0;
      }
    } else {
      return Players.findOne(playerId).stash;
    }
  }

  getKickingPlayerId() {
    const {messages} = this.props;

    const initialKick = findLast(messages, message => message.type === 'Kick' && message.initial);
    return initialKick.opponentId;
  }

  isActivePlayer(playerId) {
    const balance = this.getPlayerCurrentBalance(playerId);
    return !!balance;
  }

  renderProfile(playerId) {
    const {currentPlayerId} = this.props;

    const isActive = this.isActivePlayer(playerId) && this.isActivePlayer(currentPlayerId);
    const onClose = () => this.setState({topBar: undefined});
    const onKick = () => {
      if (playerId == currentPlayerId) {
        this.leaveGame(currentPlayerId);
      } else {
        this.kickPlayer(playerId);
      }
      this.setState({topBar: undefined});
    };
    const player = Players.findOne(playerId);
    const avatarUrl = this.getAvatarByPlayerId(playerId);

    return <PlayerProfile isActive={isActive} player={player} avatarUrl={avatarUrl} onClose={onClose} onKick={onKick} />;
  }

  renderPlayerList() {
    const {game} = this.props;

    const players = Players.find({gameId: game._id}).fetch();
    const rows = map(players, player => ({
      avatarUrl: this.getAvatarByPlayerId(player._id),
      name: this.getNameByPlayerId(player._id),
      stash: this.getPlayerCurrentBalance(player._id),
      playerId: player._id,
      showProfile: () => this.setState({displayedPlayer: player._id, topBar: 'profile'}),
    }));

    return <PlayerList rows={rows} />;
  }

  renderChat() {
    const {game, expectations} = this.props;

    const footer = game.startedAt && expectations && expectations.length ? (<div className="fixed-form top-divider">
      {this.renderLabel()}
      {this.renderAction()}
    </div>) : "";

    return (<div>
      <div className={game.startedAt && expectations && expectations.length ? "comments with-form" : "comments"}>
        {this.renderMessages()}
        {footer}
      </div>
    </div>
    );
  }

  renderMessages() {
    const {game, messages, currentPlayerId} = this.props;
    const lastRound = (_.filter(messages, i => i.type === 'Finish').length > 0) && _.filter(messages, i => i.type === 'Round').length;
    return (
      <Card.Group itemsPerRow={1}>
        {messages.map((message, index) => {
          const isLast = messages.length == index + 1;
          const parameters = this.getMessageParameters(message, _.take(messages, index + 1));
          let headerKey = `Messages.${message.type}`;

          if (message.type == 'Kick') {
            if (message.initial) {
              headerKey += "Start";
            } else {
              const suffix = message.decision ? "Agree" : "Disagree";
              headerKey += `.${suffix}`;
            }
          }

          const header = i18n.__(headerKey, parameters);
          const headerIsPresent = (header !== headerKey);
          const avatar = message.playerId ? <Image avatar floated="left" src={this.getAvatarByPlayerId(message.playerId)} /> : "";
          let text;
          let nextRoundNumber;
          let needsNextRoundDivider = false;
          if (message.type == 'Round') {
            const groupedRounds =_.groupBy(message.result, (i) => i.candidateId);
            const winner = _.find(message.result, (i) => i.winner === true);
            const loserId = _.find(Object.keys(groupedRounds), (i) => i !== winner.playerId);

            text =[
              this.formatFirstPlayerCoalition(groupedRounds[winner.playerId], winner.playerId),
              this.formatSecondPlayerCoalition(groupedRounds[loserId], loserId)
            ];
            if (lastRound !== parameters.finishedRoundNumber) {
              nextRoundNumber = parameters.finishedRoundNumber + 1;
              needsNextRoundDivider = true;
            }
          } else if (message.type == 'Finish') {
            text = this.formatGameResult(message.winner);
          } else if (message.type == 'Leave') {
            text = this.formatLeaveMessage(message.result, message.shares);
          } else if (message.type == 'Start') {
            nextRoundNumber = parameters.finishedRoundNumber + 1;
            needsNextRoundDivider = true;
          }
          const ref = isLast ? 'last-message' : undefined;
          const elements = [];
          elements.push(
            <Card key={index} ref={ref}>
              <span className="hidden _id">{message._id}</span>
              <span className="hidden createdAt">{message.createdAt.toISOString()}</span>
              <Card.Content>
                {avatar}
                {headerIsPresent && <Card.Header><div dangerouslySetInnerHTML={{ __html: header}} /></Card.Header>}
                {text && <Card.Description>
                  {text}
                  </Card.Description>}
                <Card.Meta>{moment(message.createdAt).format("HH:mm")}</Card.Meta>
              </Card.Content>
            </Card>,
          );
          if (needsNextRoundDivider) {
            elements.push(<div className="padded"><Divider horizontal>{i18n.__('Messages.NextRound', {nextRoundNumber})}</Divider></div>);
          }
          return elements;
        })}
      </Card.Group>
    );
  }

  formatLeaveMessage(players, shares) {
    return (<Accordion>
      <Accordion.Title>
        <Icon name="dropdown" />
        {i18n.__("Games.Leave.Details")}
      </Accordion.Title>
      <Accordion.Content className="no-top-paddings">
        <List className="no-top-paddings">
          {map(players, (player) => {
            const playerId = player.playerId;
            const avatarUrl = this.getAvatarByPlayerId(playerId);
            const name = this.getNameByPlayerId(playerId);
            const current = player.stash;
            const increment = shares[playerId];

            return (<List.Item key={playerId}>
              <Image avatar src={avatarUrl} />
              <List.Content>
                <List.Header>{name}</List.Header>
                <List.Description>{current} ({this.getColoredResultNumber(increment)})</List.Description>
              </List.Content>
            </List.Item>);
          })}
        </List>
      </Accordion.Content>
    </Accordion>);
  }
  formatFirstPlayerCoalition(result, playerId){
    return this.formatRoundResult(result, playerId)
  }

  formatSecondPlayerCoalition(result, playerId){
    return this.formatRoundResult(result, playerId)
  }

  formatRoundResult(result, playerId) {
    const {game} = this.props;
    return (<List relaxed key={playerId} className="coalition">
      <Header>Голосовали за {this.getNameByPlayerId(playerId)}</Header>
      {map(result, (row) => {
        const hasDetails = row.prize || row.scalp || row.fix;

        // don't allow "0%" message
        //const shareFactor = Math.round(row.share * 100);
        //const shareText = shareFactor < 1 ? "<1" : shareFactor;

        const details = hasDetails ? (<div className="round-details">
          {row.prize ? <span>
            <Icon name="law" />
            {this.getColoredResultNumber(row.prize)}
          </span> : ""}
          {row.scalp ? <span>
            <Icon name="cut" />
            {this.getColoredResultNumber(row.scalp)}
          </span> : ""}
          {row.fix ? <span>
            <Icon name="circle notched" />
            {this.getColoredResultNumber(row.fix)}
          </span> : ""}
        </div>) : "";

        return (<List.Item className="player-statistics" key={row.playerId}>
          <List.Content>
            <List.Header>
              <Image avatar src={this.getAvatarByPlayerId(row.playerId)} />
              {
                row.winner != null &&
                <Icon name="trophy" className={row.winner ? "win-color" : "lose-color"} />
              }
              {this.getNameByPlayerId(row.playerId)}
            </List.Header>
            <List className="quick-statistics no-top-paddings fixed-width-icons">
              {game.rulesetId !== 'X2' && row.candidateId && <List.Item icon="pointing up" content={<span>Ставка: {row.stake} на {row.candidateId === row.playerId ? <b>самого себя</b> : <b>{this.getNameByPlayerId(row.candidateId)}</b>}</span>} />}
              {game.rulesetId === 'X2' && row.candidateId && <List.Item icon="pointing up" content={<span>Ставка: {row.stake} {row.wasBuffed? 'x2' : ''} на {row.candidateId === row.playerId ? <b>самого себя</b> : <b>{this.getNameByPlayerId(row.candidateId)}</b>}</span>} />}
              <List.Item icon="line graph" content={<span>Баланс: {row.total} ({this.getColoredResultNumber(row.total - row.stash)})</span>} />
              <List.Item icon="info circle" content={details} />
            </List>
            <Accordion>
              <Accordion.Title>
                <Icon name="dropdown" />
                Подробнее
              </Accordion.Title>
              <Accordion.Content className="no-top-paddings">
                <List className="no-top-paddings fixed-width-icons">
                  <List.Item icon="money" content={<span>Начинает раунд с {row.stash}</span>} />
                  <List.Item icon="like outline" content={<span>{row.winner === null ? "Не участвует в пари" : `Заключает пари на ${row.bet}`}</span>} />
                  <List.Item icon="pointing up" content={<span>Ставит {row.stake}</span>} />
                  {row.candidateId && <List.Item icon="user" content={<span>Выбирает кандидата: {row.candidateId === row.playerId ? <b>самого себя</b> : <b>{this.getNameByPlayerId(row.candidateId)}</b>}</span>} />}
                  <List.Item icon="law" content={row.winner != null ? (row.winner ? <span><Icon name="trophy" /><span>Выигрывает пари {this.getColoredResultNumber(row.prize)}</span></span> : <span>Проигрывает пари {this.getColoredResultNumber(row.prize)}</span>) : 'Ничего не получает с пари'} />
                  {/*<List.Item icon='percent' content={<span>Доля в ставке {this.getColoredResultNumber(shareText, row.originalShare)}%</span>} />*/}
                  <List.Item icon="cut" content={!row.scalp ? <span>Не получает скальп</span> : (row.scalp > 0 ? <span>Получает скальп {this.getColoredResultNumber(row.scalp)}</span> : <span>Теряет скальп {this.getColoredResultNumber(row.scalp)}</span>)} />
                  <List.Item icon="circle notched" content={<span>Получает округление {this.getColoredResultNumber(row.fix)}</span>} />
                  <List.Item icon="line graph" content={<span>Заканчивает раунд с {row.total} ({this.getColoredResultNumber(row.total - row.stash)})</span>} />
                </List>
              </Accordion.Content>
            </Accordion>
          </List.Content>
        </List.Item>
        );
      },
    )}
    </List>);
  }

  getColoredResultNumber(text, original) {
    if (original === undefined) original = text;
    return original == 0 ? <span>{text}</span> : original > 0 ? <span className="win-color">+{text}</span> : <span className="lose-color">{text}</span>;
  }

  formatGameResult(winner) {
    const player = Players.findOne(winner._id);
    return (<Item className="center">
      <Item.Image src={this.getAvatarByPlayerId(winner._id)} size="small" shape="circular" />
      <Item.Content className="win-game-content">
        <span>Игру выиграл: <b>{this.getNameByPlayerId(winner._id)}</b></span>
        <div>Выигрыш составил: <b className="win-color">{player && winner.stash - player.stash}</b></div>
        <Icon name="trophy" size="huge" color="yellow" />
      </Item.Content>
    </Item>);
  }

  renderHeader(className) {
    const {game, currentPlayerId, messages} = this.props;
    const player = Players.findOne(currentPlayerId);

    const showPlayerList = () => {
      const topBar = this.state.topBar == 'players' ? undefined : 'players';
      this.setState({topBar});
    };
    let stash = player && player.stash;
    const lastRound = _.last(_.filter(messages, i => i.type === 'Round'));
    if (lastRound && lastRound.result) {
      const currentPlayerResult = _.find(lastRound.result, i => i.playerId === currentPlayerId);
      if (currentPlayerResult && currentPlayerResult.total) {
        stash = currentPlayerResult.total;
      }
    }
    return (
      <div className={className}>
        <Header as="h3">
          <Icon link name="chevron left" className="left-icon" size="small" onClick={this.onBackClick.bind(this)} />
          <Header.Content>
            {game.name}
            {game.startedAt && <Icon color="violet" className="show-player-list" link name="users" size="large" onClick={showPlayerList} />}
            {stash && <span className="balance">
              {stash} <Icon name="money" />
            </span>
            }
          </Header.Content>
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
    );
  }

  renderLabel() {
    const {expectations, currentPlayerId} = this.props;
    const expectation = first(expectations);
    const isOwn = expectation.playerId == currentPlayerId;

    if (!isOwn && (['Stake', 'Vote', 'Kick'].indexOf(expectation.type) != -1)) {
      return this.displayProgressBar();
    }

    if (expectation.type === 'Kick') {
      expectation.opponentId = this.getKickingPlayerId();
    }

    const parameters = {playerName: this.getNameByPlayerId(expectation.playerId), stash: expectation.max};
    if (expectation.opponentId) {
      parameters.opponentName = this.getNameByPlayerId(expectation.opponentId);
    }
    const message = i18n.__(`Expectations.${isOwn ? "Own" : "Other"}.${expectation.type}`, parameters);
    return (
      <Label basic color="violet" pointing="below"><div dangerouslySetInnerHTML={{ __html: message}} /></Label>
    );
  }

  renderAction() {
    const {expectations, currentPlayerId} = this.props;

    const expectation = first(expectations);
    const {schema} = expectation;
    // save last value for stake
    if (expectation.amount){
      if (expectation.type === "Stake" ) {
        if (Session.get("lastStakeValue")) {
          expectation.amount = Session.get("lastStakeValue");
        } else {
          //we don't want to show default amonut
          expectation.amount = null
        }
      }
      if (expectation.type === "Raise" ) {
        expectation.amount = null
      }
    }

    const props = {
      validate: 'onSubmit',
      model: expectation,
      schema,
      onChange: () => this.setState({}), // workaround: force recalculate the form to apply updated schema from last expectation
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
          <AutoForm onSubmit={this.onActionSubmit.bind(this)} {...props}>
            <ConnectedSelectUserFieldWithSubmit
              name="opponentId" placeholder={i18n.__("Games.SelectPlayerPlaceholder")}
              transform={this.getNameByPlayerId} allowedValues={expectation.values}
            />
          </AutoForm>
        );
      //todo deside how this is related with ruleset
      case "Buff":
        return (
          <AutoForm onSubmit={this.onActionSubmit.bind(this)} {...props}>
            <ConnectedSelectUserFieldWithSubmit
              name="opponentId" placeholder={i18n.__("Games.SelectBuffPlayerPlaceholder")}
              transform={this.getNameByPlayerId} allowedValues={expectation.values}
            />
          </AutoForm>
        );
      case "Raise":
        return (
          <AutoForm onSubmit={this.onActionAmountSubmit.bind(this)} {...props}>
            <ConnectedAmountFieldWithSubmit name="amount" placeholder={i18n.__("Games.InputAmountRaisePlaceholder")} />
          </AutoForm>
        );
      case "Stake":
        return (
          <AutoForm onSubmit={this.onActionAmountSubmit.bind(this)} {...props}>
            <ConnectedAmountFieldWithSubmit
              name="amount" placeholder={i18n.__("Games.InputAmountBetPlaceholder")}
              sessionName="lastStakeValue"
            />
          </AutoForm>
        );
      case "Vote":
        return (
          <AutoForm onSubmit={this.onActionSubmit.bind(this)} {...props}>
            <ConnectedSelectUserFieldWithSubmit
              name="candidateId" placeholder={i18n.__("Games.SelectPlayerVotePlaceholder")}
              transform={this.getNameByPlayerId} allowedValues={expectation.values}
            />
          </AutoForm>
        );
      case "Kick":
        return (
          <AutoForm onSubmit={this.onActionSubmit.bind(this)} {...props}>
            <ConnectedSelectBooleanButtons name="decision" />
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
    // console.log('playerId', playerId, user)
    return ShowAvatar(user);
  }

  getMessageParameters(message, messages) {
    const finishedRoundNumber = _.filter(messages, i => i.type === 'Round').length;
    const playerId = message.playerId;
    // Anticipating refactoring opponentId + candidateId into targetId
    const targetId = message.opponentId || message.candidateId || message.targetId;
    const player = playerId && Players.findOne(playerId).user({}, {fields: {"profile.name": 1}});
    const target = targetId && Players.findOne(targetId).user({}, {fields: {"profile.name": 1}});
    return defaults({
      playerName: player && player.profile.name,
      targetName: target && target.profile.name,
      finishedRoundNumber,
    }, message);
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
    return (<Progress percent={percent} active color="violet">
      <div dangerouslySetInnerHTML={{ __html: message}} />
    </Progress>);
  }
}

export const GamesShowContainer = createContainer(({params: {_id}}) => {
  const subscriptions = [];
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
  const currentPlayerId = currentPlayer && currentPlayer._id;

  const maxBetQuery = game && game.actions({type: "Raise"}, {sort: {amount: -1}, limit: 1}).fetch();

  const maxBet = maxBetQuery && maxBetQuery.length && maxBetQuery[0].amount;

  const data = {
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
