import { clone } from "lodash";
import { SimpleSchema } from "meteor/aldeed:simple-schema";

import TimestampedSchema from "../../../imports/common/TimestampedSchema";
import IDValidator from "../../../imports/common/IDValidator";

export const createChooseOpponentActionsFormSchema = allowedValues => new SimpleSchema({
  opponentId: {
    type: String,
    allowedValues,
  },
});

export const createVoteActionsSchema = allowedValues => new SimpleSchema({
  candidateId: {
    type: String,
    allowedValues,
  },
});

export const createKickActionsSchema = () => new SimpleSchema({
  decision: {
    type: Boolean,
  },
});

export const createBetActionsSchema = (min, stash, opponentStash) => new SimpleSchema({
  amount: {
    type: Number,
    custom() { // eslint-disable-line consistent-return
      if (this.value < min) return "betTooSmall";
      if (this.value > stash) return "betTooBig";
      if (this.value > opponentStash) return "betTooBigForOpponent";
    },
  },
});

export const createStakeActionsSchema = (min, stash) => new SimpleSchema({
  amount: {
    type: Number,
    custom() { // eslint-disable-line consistent-return
      if (this.value < min) return "stakeTooSmall";
      if (this.value > stash) return "stakeTooBig";
    },
  },
});

const ActionsSchema = new SimpleSchema([{
  gameId: {
    type: String,
    custom: IDValidator,
  },

  playerId: {
    type: String,
    custom: IDValidator,
  },

  type: {
    type: String,
    allowedValues: ["ChooseOpponent", "Raise", "Stake", "Vote", "Transfer", "Kick", "Leave", "Buff"],
  },

  amount: {
    type: Number,
    optional: true,
  },

  opponentId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

  decision: {
    type: Boolean,
    optional: true,
  },

  // TODO merge with opponentId
  candidateId: {
    type: String,
    custom: IDValidator,
    optional: true,
  },

}, TimestampedSchema]);

export const ActionsCreateSchema = ActionsSchema.pick(['gameId', 'playerId', 'type', 'amount', 'opponentId', 'candidateId', 'decision']);
export const ActionsKickSchema = ActionsSchema.pick(['gameId', 'opponentId']);
export const ActionsLeaveSchema = ActionsSchema.pick(['gameId']);

export default ActionsSchema;
