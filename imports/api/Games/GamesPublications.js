import {Meteor} from 'meteor/meteor'
import Games from './GamesCollection'

Meteor.publish('Games.active', () => {
  return Games.find({status: 'active', isPublic: true});
});
