import {Mongo} from "meteor/mongo";
import Users from "../Users/UsersCollection";
import PlayersSchema from "./PlayersSchema";

class PlayersCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Players = new PlayersCollection('Players');

// Deny all client-side updates since we will be using methods to manage this collection
Players.deny({
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

Players.attachSchema(PlayersSchema);

Players.publicFields = {};

Players.helpers({
  user(selector = {}, options = {}) {
    return Users.findOne(Object.assign({_id: this.ownerId}, selector), options)
  },
});

export default Players;
