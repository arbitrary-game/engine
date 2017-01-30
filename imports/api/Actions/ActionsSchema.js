import {SimpleSchema} from "meteor/aldeed:simple-schema";
import TimestampedSchema from "/imports/common/TimestampedSchema";
import IDValidator from "/imports/common/IDValidator";
import {clone} from "lodash";

const AmountField = {
  type: Number,
  min: 0 // the actual minimum Raise/Bet/Stake is determined by ruleset
};

export const ChooseOpponentActionsSchema = new SimpleSchema({
  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },
});

export const ChooseCandidateActionsSchema = new SimpleSchema({
  candidateId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },
});

export const RaiseActionsSchema = new SimpleSchema({
  amount: clone(AmountField)
});

export const BetActionsSchema = new SimpleSchema({
  amount: clone(AmountField)
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
    allowedValues: ["ChooseOpponent", "Raise", "Bet", "Stake", "Vote", "Transfer"],
    // When the initiator proposes a bet, his action type is "Raise"
    // When the opponent accepts a bet, his action is "Bet"
  },

  amount: {
    type: Number,
    min: 0, // the actual minimum Raise/Bet/Stake is determined by ruleset
    optional: true,
  },

}, ChooseOpponentActionsSchema, ChooseCandidateActionsSchema, RaiseActionsSchema, BetActionsSchema, TimestampedSchema]);

export const ActionsCreateSchema = ActionsSchema.pick(['gameId', 'playerId', 'type', 'amount']);

export default ActionsSchema;
