import {Meteor} from 'meteor/meteor';
import Users from './UsersCollection';

Meteor.publish("Users.current", function() {
  return Users.find(this.userId, {fields: Users.publicFields});
});
