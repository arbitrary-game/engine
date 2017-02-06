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

  stash: {
    type: Number,
    min: 0
  },

}, TimestampedSchema]);

export const PlayerCreateSchema = PlayersSchema.pick(['gameId']);

export default PlayersSchema;
