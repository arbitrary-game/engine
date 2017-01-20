import {SimpleSchema} from 'meteor/aldeed:simple-schema';

const GamesSchema = new SimpleSchema({
  name: {
    type: String,
    defaultValue: '',
    min: 3,
    max: 255
  },

  isStarted: {
    type: Boolean,
    defaultValue: false,
  },

  isPublic: {
    type: Boolean,
    defaultValue: true,
  },

  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  }
});

export const GamesCreateSchema = GamesSchema.pick(['name', 'isPublic']);

export default GamesSchema;
