import { Meteor } from 'meteor/meteor';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Transactions from './TransactionsCollection';
import {TransactionsSchemaSchema} from "./TransactionsSchema";
import Games from '../Games/GamesCollection';


export const TransactionsAdd = new ValidatedMethod({
  name: 'Transactions.add',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'You need to be logged in to call this method',
    reason: 'You need to login',
  },
  validate: TransactionsSchemaSchema.validator(),
  run: (transaction) => {
    const game = Games.findOne(transaction.gameId);
    if (!game){
      throw new Meteor.Error("500", "Game doesn't exist!");
    }
    return Transactions.insert(transaction);
  },
});
