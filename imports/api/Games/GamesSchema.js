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
    label: () => i18n.__('Game.Name')
  },

  isStarted: {
    type: Boolean,
    defaultValue: false,
  },

  isPublic: {
    type: Boolean,
    defaultValue: true,
    label: () => i18n.__('Game.IsPublic')
  },

  maxPlayers: {
    type: Number,
    min: 2, // Yes, it's possible to play The Arbitrary Game with just 2 people, although it requires a pretty special ruleset
    label: () => i18n.__('Game.MaxPlayers')
  },

  ownerId: {
    type: String,
    custom: IDValidator
  },

  ruleset: {
    type: String,
    defaultValue: 'Classic',
  },

  initiatorId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

}, TimestampedSchema]);

export const GamesCreateSchema = GamesSchema.pick(['name', 'isPublic', 'maxPlayers']);

export default GamesSchema;
