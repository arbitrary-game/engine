import { Meteor } from 'meteor/meteor';
import { find, omit } from "lodash";
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { ActionsCreateSchema, ActionsKickSchema, ActionsLeaveSchema } from "../../../imports/api/Actions/ActionsSchema";
import Actions from './ActionsCollection';
import Games from '../Games/GamesCollection';
import Players from '../Players/PlayersCollection';

export const ActionsInsert = new ValidatedMethod({
  name: 'Actions.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login',
  },
  validate: ActionsCreateSchema.validator(),
  run: (action) => {
    console.log("Actions.insert:action", action);

    const userId = Meteor.userId();
    const {gameId, type} = action;

    const game = Games.findOne(gameId);
    if (!game) {
      throw new Meteor.Error("500", "Game doesn't exist", {gameId, userId});
    }

    const player = Players.findOne({gameId, userId}, {fields: {_id: 1}});
    if (!player) {
      throw new Meteor.Error("500", "Player doesn't exist for this game", {gameId, userId});
    }
    const playerId = player._id;

    const {expectations} = game.ruleset().getState();
    console.log("Actions.insert:expectations", expectations.map(e => omit(e, 'schema')));

    const expectation = find(expectations, entry => entry.playerId === playerId && entry.type === type);
    if (!expectation) {
      throw new Meteor.Error("500", "Action is not allowed", {action});
    }

    const {schema} = expectation;
    if (!schema) {
      throw new Meteor.Error("500", "Schema is not defined for the expectation", {action, expectation});
    }

    const cleaned = schema.clean(action);
    console.log("Actions.insert:cleaned", cleaned);

    try {
      schema.validate(cleaned);
    } catch (error) {
      if (Meteor.isClient) alert("Validation failed! See logs."); // eslint-disable-line no-alert
      throw error;
    }

    // set default fields
    Object.assign(cleaned, {gameId, playerId, type});
    console.log("Actions.insert:final", cleaned);
    return Actions.insert(cleaned);
  },
});

export const ActionsKick = new ValidatedMethod({
  name: 'Actions.kick',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login',
  },
  validate: ActionsKickSchema.validator(),
  run: (action) => {
    console.log("Actions.kick:action", action);

    // TODO eliminate duplication
    const userId = Meteor.userId();
    const {gameId} = action;

    const game = Games.findOne(gameId);
    if (!game) {
      throw new Meteor.Error("500", "Game doesn't exist", {gameId, userId});
    }

    const player = Players.findOne({gameId, userId}, {fields: {_id: 1}});
    if (!player) {
      throw new Meteor.Error("500", "Player doesn't exist for this game", {gameId, userId});
    }
    const playerId = player._id;

    // TODO check if the player is active
    // TODO check if the game is not finished

    const {expectations} = game.ruleset().getState();
    console.log("Actions.kick:expectations", expectations.map(e => omit(e, 'schema')));

    // it's not allowed to initiate the second kicking procedure unless the first one is finished
    const kickExpectation = find(expectations, entry => entry.type === 'Kick');
    if (kickExpectation) {
      throw new Meteor.Error("500", "Action is not allowed", {action});
    }

    // set default fields
    Object.assign(action, {gameId, playerId, type: 'Kick', decision: true});
    console.log("Actions.kick:final", action);

    return Actions.insert(action);
  },
});

export const ActionsLeave = new ValidatedMethod({
  name: 'Actions.leave',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login',
  },
  validate: ActionsLeaveSchema.validator(),
  run: (action) => {
    console.log("Actions.leave:action", action);

    // TODO eliminate duplication
    const userId = Meteor.userId();
    const {gameId} = action;

    const game = Games.findOne(gameId);
    if (!game) {
      throw new Meteor.Error("500", "Game doesn't exist", {gameId, userId});
    }

    const player = Players.findOne({gameId, userId}, {fields: {_id: 1}});
    if (!player) {
      throw new Meteor.Error("500", "Player doesn't exist for this game", {gameId, userId});
    }
    const playerId = player._id;

    // TODO check if the player is active
    // TODO check if the game is not finished

    // set default fields
    Object.assign(action, {gameId, playerId, type: 'Leave'});
    console.log("Actions.leave:final", action);

    return Actions.insert(action);
  },
});

