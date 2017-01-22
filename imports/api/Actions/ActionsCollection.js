import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

import ActionsSchema from './ActionsSchema'

class ActionsCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Actions = new ActionsCollection('Actions');

// Deny all client-side updates since we will be using methods to manage this collection
Actions.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Actions.attachSchema(ActionsSchema);

Actions.publicFields = {
};

export default Actions;
