import {LoggedInMixin} from "meteor/tunifight:loggedin-mixin";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import Players from "../Players/PlayersCollection";
import Games from "../Games/GamesCollection";
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

    const exists = Players.find({gameId, userId: Meteor.userId()}).count() > 0;
    const {startedAt, maxPlayers, stash} = Games.findOne(gameId, {fields: {startedAt: 1}});

    if(!exists){
      throw new Meteor.Error("500", "Player already joined");
    }
    if(!startedAt){
      throw new Meteor.Error("500", "Game already started");
    }
    if(!stash){
      throw new Meteor.Error("500", "Game has no stash");
    }
    if(maxPlayers >= Players.find({gameId, userId: Meteor.userId()}).count()){
      throw new Meteor.Error("500", "Max players already joined");
    }
    const user = Meteor.user();
    // TODO count all transactions
    if (user.amount < stash){
      throw new Meteor.Error("500", "You don't have enough money for this game");
    }
    TransactionsAdd.call({type: 'out', amount: stash, userId: Meteor.userId(), gameId: gameId});
    return Players.insert({gameId, userId: Meteor.userId(), stash});
  }
});
