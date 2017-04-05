import Transactions from '/imports/api/Transactions/TransactionsCollection'
import {recalculate} from "/imports/api/Transactions/TransactionsMethods";

export default function recalculateAmount() {
  let users = Meteor.users.find();
  users.forEach( ( user ) => {
    Meteor.users.update( { _id: user._id }, {
      $set: { amount: recalculate(user._id) }
    });
  });
}