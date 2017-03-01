import {fromPairs, findKey, mapValues, clone, max, sum, filter, values, indexOf, pick, each, map, every, findLastIndex, first, last, find, findLast, without, remove, sortBy} from "lodash";
import ClassicRound from './ClassicRound';
import ClassicRuleset from './ClassicRuleset';
import {createChooseOpponentActionsFormSchema} from '../../api/Actions/ActionsSchema'

export default class X2Ruleset extends ClassicRuleset {
  getState() {
    let expectations = [];
    let messages = [];

    let kickExpectations = [];

    each(this.actions, (action, index, actions) => {
      const processedActions = actions.slice(0, index + 1);
      const activePlayers = this.getPlayersWithCash();
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

            expectations = map(activePlayers, player => this.createStakeActionFor(player._id));
          }
          else {
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
          if (!expectations.length) {
            expectations.push(this.createBuffAction());
          }
          break;
        case "Buff":
          remove(expectations, expectation => expectation.playerId == action.playerId);
          const roundResult = this.calculateResult()
          // save last round result looser
          const previousRoundLooser = find(roundResult.result, row => row.bet && !row.winner)
          console.log('previousRoundLooser', this.previousRoundLooser)
          if (previousRoundLooser && previousRoundLooser.playerId){
            this.previousRoundLooserId = previousRoundLooser.playerId
          }
          console.log('previousRoundLooserId', this.previousRoundLooserId)
          console.log('roundResult', roundResult)
          messages.push(roundResult);
          break;
        case "Transfer":
          const {playerId, receiverId, amount} = action;

          find(this.players, player => player._id == playerId).stash -= amount;
          find(this.players, player => player._id == receiverId).stash += amount;

          break;
        case "Kick":
          if (!kickExpectations.length) {
            action.initial = true;

            const restActivePlayers = filter(activePlayers, player => player._id != action.playerId && player._id != action.opponentId);
            kickExpectations = map(restActivePlayers, player => this.createKickActionFor(player._id, action.opponentId));
          } else {
            remove(kickExpectations, expectation => expectation.playerId == action.playerId);

            if (!kickExpectations.length) {
              // calculate if the player should be kicked or not
              const kicks = filter(this.roundActions, action => action.type == "Kick" && action.decision).length;
              if (kicks >= activePlayers.length / 2) {
                const message = this.kickPlayer(action.opponentId);
                messages.push(message);

                // reset the round
                messages.push(this.createRoundResetMessage());
                expectations = [];
              }
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
          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
      }
    });

    if (this.isGameFinished()) {
      messages.push(this.createGameFinishedMessage());
    }

    // a round just started
    if (!expectations.length && !this.isGameFinished()) {
      expectations.push(this.createChooseOpponentAction());
    }

    // kick expectations have higher priority than others
    expectations = kickExpectations.length > 0 ? kickExpectations : expectations;

    return {expectations, messages};
  };
  createBuffAction() {
    const playerId = this.findBuffInitiator()._id;
    const values = this.getAvailableOpponentsFor(playerId);
    return {
      type: "Buff",
      playerId,
      values,
      schema: createChooseOpponentActionsFormSchema(values)
    }
  }
  // * In the first round, this ability is given to the first player in the game (= game host).
  // * In subsequent rounds, this ability is given to player who lost the bet.
  findBuffInitiator() {
    if (this.previousRoundLooserId) {
      return this.previousRoundLooserId
    }
    const activePlayers = this.getActivePlayers();
    return first(sortBy(activePlayers, ["stash", "createdAt"]));
  }
  getPlayerStakeFor(playerId) {
    const stakeWasDoulbed = find(this.roundActions, action => action.type == "Buff" && action.opponentId == playerId)
    const stake = find(this.roundActions, action => action.type == "Stake" && action.playerId == playerId);
    return stake ? (stakeWasDoulbed ? stake.amount*2 : stake.amount) : 0;
  }
}
