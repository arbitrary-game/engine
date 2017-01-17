import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

class GamesCollection extends Mongo.Collection {

}

export default new GamesCollection('games');
