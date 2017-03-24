import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import i18n from 'meteor/universe:i18n';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'


const TransactionsSchema = new SimpleSchema([{
  type: {
    type: String,
    allowedValues: ["in", "out"],
  },

  amount: {
    type: Number,
  },

  userId: {
    type: String,
    custom: IDValidator
  },

  gameId: {
    type: String,
    custom: IDValidator,
    optional: true
  },

}, TimestampedSchema]);

export const TransactionsSchemaSchema = TransactionsSchema.pick(['type', 'amount', 'userId', 'gameId']);

export default TransactionsSchema;
