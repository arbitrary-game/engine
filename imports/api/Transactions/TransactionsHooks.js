import Transactions from './TransactionsCollection';
import {recalculate} from "./TransactionsMethods";

Transactions.after.insert((userId, transaction) => {
  Meteor.users.update( { _id: userId }, {
    $set: { amount: recalculate(userId) }
  });
});

