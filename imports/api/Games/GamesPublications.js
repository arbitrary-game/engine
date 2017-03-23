import {Meteor} from 'meteor/meteor'
import Games from './GamesCollection'
import Players from '../Players/PlayersCollection'
import Users from '../Users/UsersCollection'

Meteor.publishComposite('Games.active', function () {
  if (!this.userId) return this.ready();
  return {
    find: () => Games.find({startedAt: {$exists: false}, isPublic: true}/*, {fields: Games.publicFields}*/),
    children: [
      {
        find: game => Players.find({gameId: game._id}, {fields: Players.publicFields}),
        children: [
          {
            find: player => Users.find({_id: player.userId}, {fields: Users.publicFields})
          }
        ]
      },
      {
        find: game => Users.find({_id: game.ownerId}, {fields: Users.publicFields}),
      },
    ]
  };
});

Meteor.publishComposite('Games.joined', function () {
  if (!this.userId) return this.ready();
  return {
    find: () => Players.find({userId: this.userId}, {fields: Players.publicFields}),
    children: [
      {
        find: player => Games.find({_id: player.gameId}/*, {fields: Games.publicFields}*/),
        children: [
          {
            find: game => Players.find({gameId: game._id}, {fields: Players.publicFields}),
          },
          {
            find: game => Users.find({_id: game.ownerId}, {fields: Users.publicFields}),
          },
        ]
      },
      {
        find: player => Users.find({_id: player.userId}, {fields: Users.publicFields})
      },
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
