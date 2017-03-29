import {Meteor} from 'meteor/meteor'
import Transactions from './TransactionsCollection'

Meteor.publish('Transactions.mine', function () {
  if (!this.userId) return this.ready();
  return Transactions.find({userId: this.userId}, {fields: Transactions.publicFields});
});
