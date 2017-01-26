import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import TimestampedSchema from '/imports/common/TimestampedSchema'
import IDValidator from '/imports/common/IDValidator'

export const selectOpponentSchema = new SimpleSchema({
  playerId: {
    type: String,
    custom: IDValidator
  },
  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

  type: {
    type: String,
    allowedValues: ["Raise", "Bet", "Stake", "Vote", "ChooseOpponent"],
    // When the initiator proposes a bet, his action type is "Raise"
    // When the opponent accepts a bet, his action is "Bet"
    optional: true,
  },

  amount: {
    type: Number,
    min: 0, // the actual minimum Raise/Bet/Stake is determined by ruleset
    optional: true,
  },
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

  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

  type: {
    type: String,
    allowedValues: ["Raise", "Bet", "Stake", "Vote", "ChooseOpponent"],
    // When the initiator proposes a bet, his action type is "Raise"
    // When the opponent accepts a bet, his action is "Bet"
  },

  amount: {
    type: Number,
    min: 0, // the actual minimum Raise/Bet/Stake is determined by ruleset
    optional: true,
  },

}, TimestampedSchema]);

export const ActionsCreateSchema = ActionsSchema.pick(['gameId', 'playerId', 'type', 'amount']);

export default ActionsSchema;