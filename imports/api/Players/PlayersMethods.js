import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Players from '../Players/PlayersCollection'
import {PlayerCreateSchema} from "/imports/api/Players/PlayersSchema";

export const PlayersInsert = new ValidatedMethod({
  name: 'Players.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: null,
  run: ({gameId}) => {
    const selector = {gameId, userId: Meteor.userId()};
    console.log("selector", selector);

    const exists = Players.find(selector).count() > 0;

    if (!exists) {
      return Players.insert(selector);
    }
  }
});
