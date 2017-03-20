import {Meteor} from 'meteor/meteor'
import Games from './GamesCollection'
import Players from '../Players/PlayersCollection'
import Actions from '../Actions/ActionsCollection'
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

Meteor.publish('Games.joined', function (limit) {
  console.log('limit', limit)
  if (!this.userId) return this.ready();
  return Games.find({}, {limit: limit})
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
      },
      {
          find: game => Actions.find({gameId: game._id}, {fields: Actions.publicFields}),
      },
    ]
  };
});
