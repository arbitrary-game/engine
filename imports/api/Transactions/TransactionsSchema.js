import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import i18n from 'meteor/universe:i18n';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'


const TransactionsSchema = new SimpleSchema([{
  type: {
    type: String,
    allowedValues: ["In", "Out"],
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

export default TransactionsSchema;
