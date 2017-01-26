import {values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
import ClassicRound from './ClassicRound';

export default class ClassicRuleset {
  constructor(actions, players) {
    this.actions = sortBy(actions, "createdAt");
    this.players = players;
  }

  getState() {
    let pendingActions = [];
    let messages = [];

    each(this.actions, (action, index, actions) => {
      const processedActions = actions.slice(0, index + 1);
      const roundActions = this.getRoundActions(processedActions);

      messages.push(action);

      switch (action.type) {
        case "ChooseOpponent":
          const result = this.createRaiseOrCallAction(action["playerId"], this.getMinimalBetAmount());
          pendingActions.push(result);
          break;
        case "Raise":
          const previousBet = this.findPreviousBetFor(roundActions);
          const bet = action["amount"];
          const opponentId = this.findOpponentIdFor(action.playerId, roundActions);

          if (!previousBet || bet > previousBet) {
            const result = this.createRaiseOrCallAction(opponentId, bet);
            pendingActions = [result];
          } else {
            pendingActions = map(this.players, player => this.createStakeActionFor(player));
          }
          break;
        case "Stake":
          remove(pendingActions, pendingAction => pendingAction.playerId == action.playerId);

          // staking finished
          if (!pendingActions.length) {
            pendingActions = map(this.players, player => this.createVoteActionFor(player));
          }
          break;
        case "Vote":
          remove(pendingActions, pendingAction => pendingAction.playerId == action.playerId);

          // voting finished
          if (!pendingActions.length) {
            messages.push(this.calculateResult(roundActions));
          }
          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
      }
    });

    // a round just started
    if (!pendingActions.length) {
      pendingActions.push(this.createChooseOpponentAction());
    }

    return {pendingActions, messages};
  };

  calculateResult(actions) {
    // TODO calculate data for Round here
    const data = map(this.players, player => ({
      playerId: player._id,
      stash: player.stash,
      bet: this.getPlayerBetFor(actions, player._id),
      stake: this.getPlayerStakeFor(actions, player._id),
      votedForPlayerId: this.getCandidateIdFor(actions, player._id)
    }));

    const round = new ClassicRound(this, data);
    const result = round.calculate();
    return result;
  }

  getCandidateIdFor(actions, playerId) {
    return find(actions, action => action.type == "Vote" && action.playerId == playerId).candidateId;
  }

  getPlayerStakeFor(actions, playerId) {
    return find(actions, action => action.type == "Stake" && action.playerId == playerId).amount;
  }

  getPlayerBetFor(actions, playerId) {
    const opponents = values(pick(find(actions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
    return indexOf(opponents, playerId) != -1 ? findLast(actions, action => action.type == "Raise").amount : 0;
  }

  findOpponentIdFor(playerId, actions) {
    const action = find(actions, {type: "ChooseOpponent"});
    return action.playerId == playerId ?  action.opponentId : action.playerId;
  }

  findPreviousBetFor(actions) {
    const beforeLast = actions.length - 2;

    const previous = this.actions[beforeLast];
    if (previous.type == "Raise") {
      return previous.amount;
    }
  }

  getRoundActions(actions) {
    const from = findLastIndex(actions, {type: "ChooseOpponent"});
    return actions.slice(from);
  }

  createVoteActionFor(player) {
    return {
      type: "Vote",
      playerId: player._id
    }
  }

  createStakeActionFor(player) {
    return {
      type: "Stake",
      amount: this.getMinimalStakeAmount(),
      playerId: player._id
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
