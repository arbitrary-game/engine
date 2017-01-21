import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import Users from './UsersCollection';

Meteor.publish("Users.current", function() {
  return Users.find(this.userId, {fields: Users.publicFields});
});
