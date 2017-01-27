import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Match} from 'meteor/check';

import GamesSchema from './GamesSchema'

import Users from '../Users/UsersCollection'
import Players from '../Players/PlayersCollection'
import Actions from '../Actions/ActionsCollection'

import ClassicRuleset from "/imports/rulesets/Classic/ClassicRuleset";

class GamesCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Games = new GamesCollection('Games');

// Deny all client-side updates since we will be using methods to manage this collection
Games.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Games.attachSchema(GamesSchema);

Games.publicFields = {
  name: 1,
  isStarted: 1,
  isPublic: 1
};

Games.helpers({
  actions(selector = {}, options = {}) {
    return Actions.find(Object.assign({gameId: this._id}, selector), options);
  },
  players(selector = {}, options = {}) {
    return Players.find(Object.assign({gameId: this._id}, selector), options);
  },
  owner(selector = {}, options = {}) {
    return Users.findOne(Object.assign({_id: this.ownerId}, selector), options)
  },
  ruleset() {
    const actions = this.actions().fetch();
    const players = this.players().fetch();
    switch (this.rulesetId) {
      case "Classic":
        return new ClassicRuleset(actions, players);
        break;
      default:
        throw new Error(`Undefined ruleset ID: ${this.rulesetId}`);
        break;
    }
  }
});

export default Games;
