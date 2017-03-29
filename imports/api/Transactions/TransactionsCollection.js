import {Mongo} from 'meteor/mongo';
import TransactionsSchema from './TransactionsSchema'


class TransactionsCollection extends Mongo.Collection {
  insert(list, callback) {
    return super.insert(list, callback);
  }
}

const Transactions = new TransactionsCollection('Transactions');

// Deny all client-side updates since we will be using methods to manage this collection
Transactions.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Transactions.attachSchema(TransactionsSchema);

Transactions.publicFields = {
  amount: 1,
  type: 1,
  gameId: 1,
  userId: 1,
  createdAt: 1,
};


export default Transactions;
