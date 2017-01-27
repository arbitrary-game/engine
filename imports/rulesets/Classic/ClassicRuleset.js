import {values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
import ClassicRound from './ClassicRound';

export default class ClassicRuleset {
  constructor(actions, players) {
    this.actions = sortBy(actions, "createdAt");
    this.players = players;
  }

  getState() {
    let expectations = [];
    let messages = [];

    each(this.actions, (action, index, actions) => {
      const processedActions = actions.slice(0, index + 1);
      const roundActions = this.getRoundActions(processedActions);

      messages.push(action);

      switch (action.type) {
        case "ChooseOpponent":
          const result = this.createRaiseOrCallAction(action["playerId"], this.getMinimalBetAmount());
          expectations.push(result);
          break;
        case "Raise":
          const previousBet = this.findPreviousBetFor(roundActions);
          const bet = action["amount"];
          const opponentId = this.findOpponentIdFor(action.playerId, roundActions);

          if (!previousBet || bet > previousBet) {
            const result = this.createRaiseOrCallAction(opponentId, bet);
            expectations = [result];
          } else {
            expectations = map(this.players, player => this.createStakeActionFor(player._id));
          }
          break;
        case "Stake":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // staking finished
          if (!expectations.length) {
            expectations = map(this.players, player => this.createVoteActionFor(player._id));
          }
          break;
        case "Vote":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // voting finished
          if (!expectations.length) {
            messages.push(this.calculateResult(roundActions));
          }
          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
      }
    });

    // a round just started
    if (!expectations.length) {
      expectations.push(this.createChooseOpponentAction());
    }

    return {expectations, messages};
  };

  calculateResult(roundActions) {
    const data = map(this.players, player => ({
      playerId: player._id,
      stash: player.stash,
      bet: this.getPlayerBetFor(roundActions, player._id),
      stake: this.getPlayerStakeFor(roundActions, player._id),
      candidateId: this.getCandidateIdFor(roundActions, player._id)
    }));

    const round = new ClassicRound(this, data);
    const result = round.calculate();

    // update players stashes
    each(result, data => find(this.players, {_id: data.playerId}).stash = data.total);

    return result;
  }

  getCandidateIdFor(roundActions, playerId) {
    return find(roundActions, action => action.type == "Vote" && action.playerId == playerId).candidateId;
  }

  getPlayerStakeFor(roundActions, playerId) {
    return find(roundActions, action => action.type == "Stake" && action.playerId == playerId).amount;
  }

  getPlayerBetFor(roundActions, playerId) {
    const opponents = values(pick(find(roundActions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
    return indexOf(opponents, playerId) != -1 ? findLast(roundActions, action => action.type == "Raise").amount : 0;
  }

  findOpponentIdFor(playerId, roundActions) {
    const action = find(roundActions, {type: "ChooseOpponent"});
    return action.playerId == playerId ?  action.opponentId : action.playerId;
  }

  findPreviousBetFor(roundActions) {
    const beforeLast = roundActions.length - 2;

    const previous = this.actions[beforeLast];
    if (previous.type == "Raise") {
      return previous.amount;
    }
  }

  getRoundActions(actions) {
    const from = findLastIndex(actions, {type: "ChooseOpponent"});
    return actions.slice(from);
  }

  createVoteActionFor(playerId) {
    return {
      type: "Vote",
      playerId
    }
  }

  createStakeActionFor(playerId) {
    return {
      type: "Stake",
      amount: this.getMinimalStakeAmount(),
      playerId
    }
  }

  createChooseOpponentAction() {
    return {
      type: "ChooseOpponent",
      playerId: this.findInitiator()._id
    }
  }

  createRaiseOrCallAction(playerId, amount) {
    return {
      type: "Raise",
      playerId,
      amount
    }
  }

  findInitiator() {
    return first(sortBy(this.players, ["stash", "createdAt"]));
  }

  getMinimalBetAmount() {
    return 10;
  }

  getMinimalStakeAmount() {
    return 10;
  }

}
