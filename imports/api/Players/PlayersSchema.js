import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const PlayersSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  gameId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

});

export default PlayersSchema;
