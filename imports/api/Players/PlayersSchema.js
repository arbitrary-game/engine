import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'

const PlayersSchema = new SimpleSchema([{
  userId: {
    type: String,
    custom: IDValidator
  },

  gameId: {
    type: String,
    custom: IDValidator
  },

}, TimestampedSchema]);

export default PlayersSchema;
