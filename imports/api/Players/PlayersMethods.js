import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Players from '../Players/PlayersCollection'
import Games from '../Games/GamesCollection'
import {PlayerCreateSchema} from "/imports/api/Players/PlayersSchema";

export const PlayersInsert = new ValidatedMethod({
  name: 'Players.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: PlayerCreateSchema.validator(),
  run: ({gameId}) => {
    const selector = {gameId, userId: Meteor.userId()};

    const exists = Players.find(selector).count() > 0;
    const {isStarted} = Games.findOne(gameId, {fields: {isStarted: 1}});

    if (!exists && !isStarted) {
      return Players.insert(selector);
    }
  }
});
