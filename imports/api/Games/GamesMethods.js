import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Games from './GamesCollection'
import Players from '../Players/PlayersCollection'
import {GamesCreateSchema} from "/imports/api/Games/GamesSchema";
import {ChooseOpponentActionsSchema} from "../Actions/ActionsSchema";
import {ActionsInsert} from "/imports/api/Actions/ActionMethods";
import IDValidator from '/imports/common/IDValidator'


export const GamesInsert = new ValidatedMethod({
  name: 'Games.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: GamesCreateSchema.validator(),
  run: (game) => {
    Object.assign(game, {ownerId: Meteor.userId()});

    // TODO calculate stash somehow
    const stash = 500;

  	const gameId = Games.insert(game);
    Players.insert({gameId, stash, userId: Meteor.userId()});

    return gameId;
  }
});

export const GamesStart = new ValidatedMethod({
  name: 'Games.start',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: new SimpleSchema({
    gameId: {
      type: String
    }
  }).validator(),
  run: ({gameId}) => {
    const game = Games.findOne(gameId);

    if (game.ownerId != Meteor.userId()) {
      throw new Meteor.Error("403", "Only owner can start the game");
    }

    if (game.players().count() < 3) {
      throw new Meteor.Error("500", "You need at least 3 players to start the game");
    }

    // select initiator
    // Designate the player with the smallest amount of coins as the bet initiator
    // (if > 2 players have the same amount, choose the one that has joined the game earlier - use `Player::createdAt` field)
    const players = game.players({}, {sort: {stash: 1, createdAt: 1}, limit: 1}).fetch();
    const initiator = players[0];
    if (!initiator){
        throw new Meteor.Error("500", "Internal error");
    }
    Games.update(gameId, {$set: {isStarted: true, initiatorId: initiator.userId}});
  }
});

// TODO maybe move to actions
export const GamesSetOpponent = new ValidatedMethod({
  name: 'Games.setOpponent',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: new SimpleSchema({
    gameId: {
      type: String,
      custom: IDValidator,
    },
    opponent: {
      type: ChooseOpponentActionsSchema
    },
  }).validator(),
  run: ({gameId, opponent}) => {
    const game = Games.findOne(gameId);

    if (game.initiatorId != Meteor.userId()) {
      throw new Meteor.Error("403", "Only initiator can set opponent");
    }

    console.log('ActionsInsert');
    Games.update(gameId, {$set: {opponentId: opponent.opponentId}});
    opponent.gameId = game._id;
    return ActionsInsert.call(opponent);
  }
});
