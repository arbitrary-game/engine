// 'use strict';
// /* eslint-env mocha */
// import _ from 'lodash';
// import {Meteor} from 'meteor/meteor';
// import {expect} from 'meteor/practicalmeteor:chai';
// import {GamesInsert} from "/imports/api/Games/GamesMethods";
// // import ClassicRuleset from './ClassicRuleset';
// // import ClassicRound from './ClassicRound';
//
// if (Meteor.isServer) {
//   /* activate */
//   should();
//
//   describe('Game tests', function() {
//     it('Create game with enough money', function() {
//       Meteor.users.remove({})
//       var id = Accounts.createUser({
//         email: "test@example.com",
//         password: "somepassword",
//         profile: { name: "someusername"}
//       });
//       const user = Meteor.users.findOne(id)
//       expect(user.amount).to.be.equal(0);
//       // console.log(Meteor.users.find().fetch())
//       // Meteor.loginWithToken(id);
//       console.log(this.userId)
//
//       // GamesInsert.call({name: 'test', maxPlayers: 3, rulesetId: 'Classic'})
//       // GamesInsert
//     })
//   });
//   //
//   // describe('Create game with enouth money with not enough money', function() {
//   //   // GamesInsert
//   // });
//   //
//   // describe('Join game with enough money', function() {
//   //   // GamesInsert
//   // });
//   //
//   // describe('Join game with enouth money with not enough money', function() {
//   //   // GamesInsert
//   // });
//
// }
