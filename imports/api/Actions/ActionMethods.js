import { find } from "lodash";

import {Meteor} from 'meteor/meteor';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ActionsCreateSchema } from "/imports/api/Actions/ActionsSchema";
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
    const {gameId, playerId, type} = action;

    if (!type) {
      throw new Meteor.Error("500", "Type should be set", {action});
    }

    if (!gameId) {
      throw new Meteor.Error("500", "GameId should be set", {action});
    }
    const game = Games.findOne(gameId);
    if (!game) {
      throw new Meteor.Error("500", "Game doesn't exist", {action, gameId});
    }

    if (!playerId) {
      throw new Meteor.Error("500", "PlayerId should be set", {action});
    }
    const player = Players.findOne(playerId, {fields: {userId: 1}});
    if (!player) {
      throw new Meteor.Error("500", "Player doesn't exist", {action, playerId});
    }

    if (Meteor.userId() !== player.userId) {
      throw new Meteor.Error("500", "You can't create actions for another user", {action, userId: Meteor.userId()});
    }

    const {expectations} = game.ruleset().getState();
    console.log("Actions.insert:expectations", expectations);

    const expectation = find(expectations, entry => entry.playerId === action.playerId && entry.type === type);

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
      if (Meteor.isClient) alert("Validation failed! See logs.");
      throw error;
    }

    // set default fields
    Object.assign(cleaned, {gameId, playerId, type});
    console.log("Actions.insert:final", cleaned);

    return Actions.insert(cleaned);
  },
});

