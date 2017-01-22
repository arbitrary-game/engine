import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'

const ActionsSchema = new SimpleSchema([{
  playerId: {
    type: String,
    custom: IDValidator
  },

  type: {
    type: String,
    allowedValues: ["Raise", "Bet", "Stake", "Vote"]
    // When the initiator proposes a bet, his action type is "Raise"
    // When the opponent accepts a bet, his action is "Bet"
  },

  amount: {
    type: Number,
    min: 0 // the actual minimum Raise/Bet/Stake is determined by ruleset
  }
}, TimestampedSchema]);

export default ActionsSchema;
