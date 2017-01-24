import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'

export const selectOpponentSchema = new SimpleSchema({
    opponentId: {
        type: String,
        custom: IDValidator,
    },
    amount: {
        type: Number,
        min: 0 // the actual minimum Raise/Bet/Stake is determined by ruleset
    }
});

export const placeABetSchema = new SimpleSchema({
    amount: {
        type: Number,
        min: 0 // the actual minimum Raise/Bet/Stake is determined by ruleset
    }
});

const ActionsSchema = new SimpleSchema([{
  gameId: {
      type: String,
      custom: IDValidator
  },

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

export const ActionsCreateSchema = ActionsSchema.pick(['gameId', 'playerId', 'type', 'amount']);

export default ActionsSchema;