import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

import PlayersSchema from './PlayersSchema'

class PlayersCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Players = new PlayersCollection('Players');

// Deny all client-side updates since we will be using methods to manage this collection
Players.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Players.attachSchema(PlayersSchema);

Players.publicFields = {
};

export default Players;
