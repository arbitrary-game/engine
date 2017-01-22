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
