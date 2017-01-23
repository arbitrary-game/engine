import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Games from './GamesCollection'
import Players from '../Players/PlayersCollection'
import {GamesCreateSchema} from "/imports/api/Games/GamesSchema";
import _ from 'underscore'

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
    _.extend(game, {ownerId: Meteor.userId()});

  	const gameId = Games.insert(game);
    Players.insert({gameId, userId: Meteor.userId()});

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
      throw new Meteor.Error("403", "Only owner of the Game can start");
    }

    if (game.players().length < 3) {
      throw new Meteor.Error("500", "You need at least 3 player in order to start");
    }
    //select initiator
    // Designate the player with the smallest amount of coins as the bet initiator
    // (if > 2 players have the same amount, choose the one that has joined the game earlier - use `Player::createdAt` field)
    const playerWithMinStash = _.min(game.players(), a => a.stash);
    const playersWithMinStash = _.sortBy(_.filter(game.players(), a => a.stash == playerWithMinStash.stash), a => a.updatedAt);
    if (!playersWithMinStash.length){
        throw new Meteor.Error("500", "Internal error");
    }
    Games.update(gameId, {$set: {isStarted: true, initiatorId: playersWithMinStash[0].userId}});


  }
});
