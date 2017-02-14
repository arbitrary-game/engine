import {clone, sum, filter, values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
import ClassicRound from './ClassicRound';
import {createChooseOpponentActionsFormSchema, createBetActionsSchema, createStakeActionsSchema, createVoteActionsSchema} from '../../api/Actions/ActionsSchema'

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
      this.roundActions = this.getRoundActions(processedActions);

      messages.push(action);

      switch (action.type) {
        case "ChooseOpponent":
          expectations.push(this.createRaiseAction(action["playerId"]));
          break;
        case "Raise":
          const bet = action["amount"];
          const opponentId = this.findOpponentIdFor(action.playerId);
          const previousRise = this.findPreviousBet();
          if (previousRise && previousRise == bet) {
            // change action type to display appropriate message
            action.type = "Call";

            expectations = map(this.getActivePlayers(), player => this.createStakeActionFor(player._id));
          }
          else {
            expectations = [this.createRaiseAction(opponentId)];
          }

          break;
        case "Stake":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // staking finished
          if (!expectations.length) {
            messages.push(this.createCheckMessage());
            expectations = map(this.getActivePlayers(), player => this.createVoteActionFor(player._id));
          }
          break;
        case "Vote":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // voting finished
          if (!expectations.length) {
            messages.push(this.calculateResult());

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

  calculateResult() {
    const data = map(this.players, player => ({
      playerId: player._id,
      stash: player.stash,
      bet: this.getPlayerBetFor(player._id),
      stake: this.getPlayerStakeFor(player._id),
      candidateId: this.getCandidateIdFor(player._id)
    }));

    const round = new ClassicRound(this, data);
    const result = round.calculate();

    // update players stashes
    each(result, data => find(this.players, {_id: data.playerId}).stash = data.total);

    return {
      result,
      type: "Round",
      createdAt: last(this.roundActions).createdAt
    };
  }

  getCandidateIdFor(playerId) {
    return find(this.roundActions, action => action.type == "Vote" && action.playerId == playerId).candidateId;
  }

  getPlayerStakeFor(playerId) {
    return find(this.roundActions, action => action.type == "Stake" && action.playerId == playerId).amount;
  }

  getPlayerBetFor(playerId) {
    const opponents = values(pick(find(this.roundActions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
    return indexOf(opponents, playerId) != -1 ? findLast(this.roundActions, action => action.type == "Raise").amount : 0;
  }

  getCandidateIds() {
    //TODO we should use findLast everywhere since we have rounds
    return values(pick(findLast(this.actions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
  }

  findOpponentIdFor(playerId) {
    const action = find(this.roundActions, {type: "ChooseOpponent"});
    return action.playerId == playerId ?  action.opponentId : action.playerId;
  }

  findPreviousBet() {
    // check if it's the very first bet
    if (this.roundActions.length < 2) return;

    const beforeLast = this.roundActions.length - 2;

    const previous = this.roundActions[beforeLast];
    if (previous.type == "Raise") {
      return previous.amount;
    }
  }

  getRoundActions(actions) {
    const from = findLastIndex(actions, {type: "ChooseOpponent"});
    return actions.slice(from);
  }

  createVoteActionFor(playerId) {
    const values = this.getCandidateIds();

    return {
      type: "Vote",
      playerId,
      values,
      schema: createVoteActionsSchema(values)
    }
  }

  createStakeActionFor(playerId) {
    const player = this.findPlayerById(playerId);

    const bet = last(this.roundActions).amount;
    const isCandidate = this.getCandidateIds().indexOf(playerId) != -1;
    const max = isCandidate ? player.stash - bet : player.stash;
    const min = Math.min(max, this.getMinimalStakeAmount());

    return {
      type: "Stake",
      amount: min,
      schema: createStakeActionsSchema(min, max),
      max: max,
      playerId
    }
  }

  createChooseOpponentAction() {
    const playerId = this.findInitiator()._id;
    const values = this.getAvailableOpponentsFor(playerId);
    return {
      type: "ChooseOpponent",
      playerId,
      values,
      schema: createChooseOpponentActionsFormSchema(values)
    }
  }

  getAvailableOpponentsFor(playerId) {
    const activePlayers = this.getActivePlayers();
    const activeOpponents = filter(activePlayers, player => player._id != playerId);
    const sortedOpponents = sortBy(activeOpponents, ["createdAt"]);
    return map(sortedOpponents, player => player._id);
  }

  createRaiseAction(playerId) {
    const player = this.findPlayerById(playerId);

    const candidateStash = player.stash;
    const bet = last(this.roundActions).amount;
    const opponentId = this.findOpponentIdFor(playerId);
    const opponent = this.findPlayerById(opponentId);
    const opponentStash = opponent.stash;
    const min = bet || Math.min(candidateStash, this.getMinimalBetAmount(), opponentStash);
    const max = Math.min(opponentStash, candidateStash)
    return {
      type: "Raise",
      playerId,
      schema: createBetActionsSchema(min, candidateStash, opponentStash),
      amount: min,
      max: max,
    }
  }

  findPlayerById(playerId) {
    return find(this.players, player => player._id == playerId);
  }

  getActivePlayers() {
    return filter(this.players, player => player.stash > 0);
  }

  findInitiator() {
    const activePlayers = this.getActivePlayers();

    // exclude the last initiator from the list
    const lastChooseOpponentAction = find(this.roundActions, action => action.type == 'ChooseOpponent');
    if (lastChooseOpponentAction) {
      const lastPlayerId = lastChooseOpponentAction.playerId;
      remove(activePlayers, player => player._id == lastPlayerId);
    }

    return first(sortBy(activePlayers, ["stash", "createdAt"]));
  }

  getMinimalBetAmount() {
    return 10;
  }

  getMinimalStakeAmount() {
    return 10;
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
