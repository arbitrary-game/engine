import {fromPairs, findKey, mapValues, clone, max, sum, filter, values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
import ClassicRound from './ClassicRound';
import {createChooseOpponentActionsFormSchema, createBetActionsSchema, createStakeActionsSchema, createVoteActionsSchema, createKickActionsSchema} from '../../api/Actions/ActionsSchema';

export default class ClassicRuleset {
  constructor(actions, players) {
    this.actions = sortBy(actions, "createdAt");
    this.players = players;
    this.roundClass = ClassicRound;
  }

  getState() {
    let expectations = [];
    const messages = [];

    let kickExpectations = [];
    let currentKickPlayerId;

    each(this.actions, (action, index, actions) => {
      const processedActions = actions.slice(0, index + 1);
      const activePlayers = this.getPlayersWithCash();
      this.roundActions = this.getRoundActions(processedActions);

      messages.push(action);

      switch (action.type) {
        case "ChooseOpponent":
          expectations.push(this.createRaiseAction(action.playerId));
          break;
        case "Raise":
          const bet = action.amount;
          const opponentId = this.findOpponentIdFor(action.playerId);
          const previousRise = this.findPreviousBet();
          if (previousRise && previousRise == bet) {
            // change action type to display appropriate message
            action.type = "Call";

            expectations = map(activePlayers, player => this.createStakeActionFor(player._id));
          } else {
            if (!previousRise) {
              action.type = "Offer";
            }
            expectations = [this.createRaiseAction(opponentId)];
          }

          break;
        case "Stake":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // staking finished
          if (!expectations.length) {
            messages.push(this.createCheckMessage());
            expectations = map(activePlayers, player => this.createVoteActionFor(player._id));
          }
          break;
        case "Vote":
          remove(expectations, expectation => expectation.playerId == action.playerId);

          // voting finished
          if (!expectations.length && this.isFullyLoaded()) {
            const roundResult = this.calculateResult();
            if (roundResult.draw) {
              messages.push(this.createDrawMessage());
            }
            messages.push(roundResult);
          }
          break;
        case "Transfer":
          const {playerId, receiverId, amount} = action;

          find(this.players, player => player._id == playerId).stash -= amount;
          find(this.players, player => player._id == receiverId).stash += amount;

          break;
        case "Kick":
          if (!kickExpectations.length) {
            action.initial = true;
            currentKickPlayerId = action.opponentId;

            const restActivePlayers = filter(activePlayers, player => player._id != action.playerId && player._id != action.opponentId);
            kickExpectations = map(restActivePlayers, player => this.createKickActionFor(player._id));
          } else {
            remove(kickExpectations, expectation => expectation.playerId == action.playerId);

            if (!kickExpectations.length) {
              // TODO bug multiple kicks within a single round won't work properly

              // calculate if the player should be kicked or not
              const kicks = filter(this.roundActions, action => action.type == "Kick" && action.decision).length;
              if (kicks >= activePlayers.length / 2) {
                const message = this.kickPlayer(currentKickPlayerId);
                messages.push(message);

                // reset the round
                messages.push(this.createRoundResetMessage());
                expectations = [];
              }
            } else {
              // TODO provide "kick cancel" message
            }
          }
          break;
        case "Leave":
          const message = this.kickPlayer(action.playerId);
          messages.pop(); // drop default action
          messages.push(message);

          // reset the round
          messages.push(this.createRoundResetMessage());
          expectations = [];
          kickExpectations = [];
          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
      }
    });

    if (this.isGameFinished()) {
      messages.push(this.createGameFinishedMessage());
    }

    // a round just started
    if (!expectations.length) {
      expectations.push(this.createChooseOpponentAction());
    }

    if (!this.isGameFinished()) {
      // kick expectations have higher priority than others
      expectations = kickExpectations.length > 0 ? kickExpectations : expectations;
    } else {
      expectations = [];
    }

    return {expectations, messages};
  }

  isFullyLoaded() {
    return every(this.roundActions, ClassicRuleset.hasSanitisedField);
  }

  static hasSanitisedField(action) {
    if (action.type === 'Stake') {
      return action.amount !== undefined;
    }

    if (action.type === 'Vote') {
      return action.candidateId !== undefined;
    }

    return true;
  }

  kickPlayer(playerId) {
    const self = find(this.players, player => player._id == playerId);
    const {stash} = self;

    const activePlayers = filter(this.getPlayersWithCash(), player => player._id != playerId);
    const playersCoinsToWin = this.getCoinsToWin(activePlayers);
    const coinsToWin = values(playersCoinsToWin);
    const maxCoinsNeeded = max(coinsToWin);
    const looserId = findKey(playersCoinsToWin, coins => coins == maxCoinsNeeded);
    const overall = sum(coinsToWin);
    const playersShares = mapValues(playersCoinsToWin, coins => Math.floor(stash * coins / overall));

    const shared = sum(values(playersShares));
    const fix = stash - shared;
    playersShares[looserId] += fix;

    each(activePlayers, player => player.stash += playersShares[player._id]);

    // propagate _id to playerId for visualization purpose
    each(activePlayers, player => player.playerId = player._id);

    self.stash = 0;

    return this.createPlayerLeaveMessage(playerId, activePlayers, playersShares);
  }

  getCoinsToWin(activePlayers) {
    const half = this.calculateOverallStash() / 2;
    return fromPairs(map(activePlayers, player => [player._id, half - player.stash]));
  }

  getPlayersDataForRound(player) {
    return {
      playerId: player._id,
      stash: player.stash,
      bet: this.getPlayerBetFor(player._id),
      stake: this.getPlayerStakeFor(player._id),
      candidateId: this.getCandidateIdFor(player._id),
    };
  }

  calculateResult() {
    const data = map(this.players, player => this.getPlayersDataForRound(player));
    const round = new this.roundClass(this, data);
    round.validate();
    const result = round.calculate();

    // update players stashes
    each(result, data => find(this.players, {_id: data.playerId}).stash = data.total);
    return {
      result,
      type: "Round",
      draw: _.filter(result, i => i.winner == true).length > 1,
      createdAt: last(this.roundActions).createdAt,
    };
  }

  getCandidateIdFor(playerId) {
    const candidate = find(this.roundActions, action => action.type == "Vote" && action.playerId == playerId);
    return candidate ? candidate.candidateId : null;
  }

  getPlayerStakeFor(playerId) {
    const stake = find(this.roundActions, action => action.type == "Stake" && action.playerId == playerId);
    return stake ? stake.amount : 0;
  }

  getPlayerBetFor(playerId) {
    const opponents = values(pick(find(this.roundActions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
    const hasBet = indexOf(opponents, playerId) != -1;
    if (hasBet) {
      const action = findLast(this.roundActions, action => action.type == "Raise" || action.type == "Offer");
      return action ? action.amount : 0;
    } else {
      return 0;
    }
  }

  getCandidateIds() {
    //TODO we should use findLast everywhere since we have rounds
    return values(pick(findLast(this.actions, {type: "ChooseOpponent"}), "playerId", "opponentId"));
  }

  findOpponentIdFor(playerId) {
    const action = find(this.roundActions, {type: "ChooseOpponent"});
    return action.playerId == playerId ? action.opponentId : action.playerId;
  }

  findPreviousBet() {
    // check if it's the very first bet
    if (this.roundActions.length < 2) return;

    const beforeLast = this.roundActions.length - 2;

    const previous = this.roundActions[beforeLast];
    if (previous.type == "Raise" || previous.type == "Offer") {
      return previous.amount;
    }
  }

  getRoundActions(actions) {
    const from = findLastIndex(actions, {type: "ChooseOpponent"});
    return from != -1 ? actions.slice(from) : actions;
  }

  createVoteActionFor(playerId) {
    const values = this.getCandidateIds();

    return {
      type: "Vote",
      playerId,
      values,
      schema: createVoteActionsSchema(values),
    };
  }

  createKickActionFor(playerId) {
    return {
      type: "Kick",
      playerId,
      schema: createKickActionsSchema(),
    };
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
      max,
      min,
      playerId,
    };
  }

  createChooseOpponentAction() {
    const playerId = this.findInitiator()._id;
    const values = this.getAvailableOpponentsFor(playerId);
    return {
      type: "ChooseOpponent",
      playerId,
      values,
      schema: createChooseOpponentActionsFormSchema(values),
    };
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
    const max = Math.min(opponentStash, candidateStash);
    return {
      type: "Raise",
      playerId,
      schema: createBetActionsSchema(min, candidateStash, opponentStash),
      amount: min,
      min,
      max,
    };
  }

  findPlayerById(playerId) {
    return find(this.players, player => player._id == playerId);
  }

  getPlayersWithCash() {
    return filter(this.players, player => player.stash - this.getPlayerBetFor(player._id) > 0);
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
    return !!this.getWinnerOfTheGame();
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
      type: "Check",
    };
  }

  createPlayerLeaveMessage(playerId, players, shares) {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "Leave",
      playerId,
      result: players,
      shares,
    };
  }

  createRoundResetMessage() {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "RoundReset",
    };
  }

  createGameFinishedMessage() {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "Finish",
      winner: this.getWinnerOfTheGame(),
    };
  }

  createDrawMessage() {
    const {createdAt} = last(this.actions);

    return {
      createdAt,
      type: "Draw",
    };
  }
}
