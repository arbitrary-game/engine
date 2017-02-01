import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import i18n from 'meteor/universe:i18n';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'


const GamesSchema = new SimpleSchema([{
  name: {
    type: String,
    defaultValue: '',
    min: 3,
    max: 255,
    label: () => i18n.__('Games.Name')
  },

  startedAt: {
    type: Date,
    optional: true
  },

  isPublic: {
    type: Boolean,
    defaultValue: true,
    label: () => i18n.__('Games.IsPublic')
  },

  maxPlayers: {
    type: Number,
    min: 2, // Yes, it's possible to play The Arbitrary Game with just 2 people, although it requires a pretty special ruleset
    label: () => i18n.__('Games.MaxPlayers')
  },

  ownerId: {
    type: String,
    custom: IDValidator
  },

  rulesetId: {
    type: String,
    defaultValue: 'Classic',
  },

  stash: {
    type: Number,
    defaultValue: 500,
    min: 0,
  },

}, TimestampedSchema]);

export const GamesCreateSchema = GamesSchema.pick(['name', 'isPublic', 'maxPlayers']);

export default GamesSchema;
