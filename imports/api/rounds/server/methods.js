import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import Round from '../../rules/default/Round'

new ValidatedMethod({
  name: "games.calculaterRound",
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login'
  },
  validate: new SimpleSchema({
    player: {type: String},
    stash: {type: Number},
    bet: {type: Number},
    stake: {type: Number},
    vote: {type: String},
  }).validator(),
  run: ({name}) => {
    const round = new Round(params);
    return round.calulate();
  }
});
