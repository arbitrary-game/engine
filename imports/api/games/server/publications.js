import {Meteor} from 'meteor/meteor'
import Games from '../games'

Meteor.publish("games.active", () => {
  return Games.find({status: "active"});
});
