import {SimpleSchema} from "meteor/aldeed:simple-schema";
import TimestampedSchema from "/imports/common/TimestampedSchema";
import IDValidator from "/imports/common/IDValidator";
import {clone} from "lodash";

const AmountField = {
  // label: () => i18n.__('Games.Amount'),
  type: Number,
  min: 0 // the actual minimum Raise/Bet/Stake is determined by ruleset
};

export const ChooseOpponentActionsFormSchema = new SimpleSchema({
  opponentId: {
    type: String,
    custom: IDValidator,
  },
});

export const ChooseOpponentActionsSchema = new SimpleSchema({
  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },
});

export const ChooseOpponentActionsSchemaForMethod = new SimpleSchema({
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
    allowedValues: ["ChooseOpponent", "Raise", "Stake", "Vote", "Transfer"],
  },
});

export const VoteActionsSchemaForMethod = new SimpleSchema({
  playerId: {
    type: String,
    custom: IDValidator
  },

  candidateId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },


  type: {
    type: String,
    allowedValues: ["ChooseOpponent", "Raise", "Stake", "Vote", "Transfer"],
  },
});

export const VoteActionsSchema = new SimpleSchema({
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

export const StubActionsSchema = new SimpleSchema({
  amount: {
    type: Number,
    min: 0,
    optional: true,
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
    allowedValues: ["ChooseOpponent", "Raise", "Stake", "Vote", "Transfer"],
  },

  amount: {
    type: Number,
    min: 0, // the actual minimum Raise/Bet/Stake is determined by ruleset
    optional: true,
  },

  candidateId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

}, ChooseOpponentActionsSchema, RaiseActionsSchema, BetActionsSchema, VoteActionsSchema, TimestampedSchema]);

export const ActionsCreateSchema = ActionsSchema.pick(['gameId', 'playerId', 'type', 'amount', 'opponentId', 'candidateId']);

export default ActionsSchema;
