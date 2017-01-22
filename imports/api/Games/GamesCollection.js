import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

import GamesSchema from './GamesSchema'

import Players from '../Players/PlayersCollection'

class GamesCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Games = new GamesCollection('Games');

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Games.attachSchema(GamesSchema);

Games.publicFields = {
  name: 1,
  isStarted: 1,
  isPublic: 1
};

Games.helpers({
  players() {
    return Players.find({gameId: this._id}).fetch();
  }
});

export default Games;
