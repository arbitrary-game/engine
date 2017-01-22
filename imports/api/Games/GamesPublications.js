import {Meteor} from 'meteor/meteor'
import Games from './GamesCollection'
import Players from '../Players/PlayersCollection'
import Users from '../Users/UsersCollection'

Meteor.publishComposite('Games.active', function () {
  if (!this.userId) return this.ready();
  return {
    find: () => Games.find({isStarted: false, isPublic: true}, Games.publicFields),
    children: [
      {
        find: game => Players.find({gameId: game._id}, {fields: Players.publicFields}),
        children: [
          {
            find: player => Users.find({_id: player.userId}, {fields: Users.publicFields})
          }
        ]
      }
    ]
  };
});

Meteor.publishComposite('Games.showById', function(_id) {
  check(_id, String);
  if (!this.userId) return this.ready();

  return {
    find: () => Games.find({_id}),
    children: [
      {
        find: game => Players.find({gameId: game._id}, {fields: Players.publicFields}),
        children: [
          {
            find: player => Users.find({_id: player.userId}, {fields: Users.publicFields})
          }
        ]
      }
    ]
  };
});
