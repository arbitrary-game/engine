import {clone, sum, filter, values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
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
          expectations.push(this.createRaiseAction(action["playerId"], this.getMinimalBetAmount()));
          break;
          // TODO fix tests
        // case "Check":
        //   expectations = map(this.players, player => this.createStakeActionFor(player._id));
        //   break;
        case "Raise":
          const bet = action["amount"];
          const opponentId = this.findOpponentIdFor(action.playerId, roundActions);
          const previousRise = this.findPreviousBetFor(roundActions);
          if (previousRise && previousRise == bet) {
            // change action type to display appropriate message
            action.type = "Call";

            expectations = map(this.players, player => this.createStakeActionFor(player._id));
          }
          else {
            expectations = [this.createRaiseAction(opponentId, bet)];
          }

          break;
        case "Stake":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // staking finished
          if (!expectations.length) {
            messages.push(this.createCheckMessage());
            expectations = map(this.players, player => this.createVoteActionFor(player._id));
          }
          break;
        case "Vote":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // voting finished
          if (!expectations.length) {
            messages.push(this.calculateResult(roundActions));

            if (this.isGameFinished()) {
              messages.push(this.createGameFinishedMessage());
            }
          }
          break;
        case "Transfer":
          const {playerId, receiverId, amount} = action;

          find(this.players, player => player._id == playerId).stash -= amount;
          find(this.players, player => player._id == receiverId).stash += amount;

          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
      }
    });

    // a round just started
    if (!expectations.length && !this.isGameFinished()) {
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

    return {
      result,
      type: "Round",
      createdAt: last(roundActions).createdAt
    };
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

  getCandidateIds() {
    //TODO we should use findLast everywhere since we have rounds
    return values(pick(findLast(this.actions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
  }

  findOpponentIdFor(playerId, roundActions) {
    const action = find(roundActions, {type: "ChooseOpponent"});
    return action.playerId == playerId ?  action.opponentId : action.playerId;
  }

  findPreviousBetFor(roundActions) {
    const beforeLast = roundActions.length - 2;

    const previous = roundActions[beforeLast];
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

  createRaiseAction(playerId, amount) {
    return {
      type: "Raise",
      playerId,
      amount
    }
  }

  findInitiator() {
    const inGamePlayers = filter(this.players, player => player.stash > 0);
    return first(sortBy(inGamePlayers, ["stash", "createdAt"]));
  }

  getMinimalBetAmount() {
    return 10;
  }

  getMinimalStakeAmount() {
    return 0;
  }

  isGameFinished() {
    return !! this.getWinnerOfTheGame();
  }

  getWinnerOfTheGame() {
    const overall = this.calculateOverallStash();
    const controlAmount = overall / 2;

    return find(this.players, player => player.stash >= controlAmount);
  }

  calculateOverallStash() {
    return sum(map(this.players, player => player.stash));
  }

  createCheckMessage() {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "Check"
    };
  }

  createGameFinishedMessage() {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "Finish",
      winner: this.getWinnerOfTheGame()
    };
  }
}
