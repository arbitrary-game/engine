import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

import GamesSchema from './GamesSchema'

class GamesCollection extends Mongo.Collection {

}

const Games = new GamesCollection('Games');

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Games.attachSchema(GamesSchema);

export default Games;
