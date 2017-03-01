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
          // a round just started
          messages.push(this.calculateResult());
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
  findBuffInitiator() {
    const activePlayers = this.getActivePlayers();

    // exclude the last initiator from the list
    const lastChooseOpponentAction = find(this.roundActions, action => action.type == 'ChooseOpponent');
    if (lastChooseOpponentAction) {
      const lastPlayerId = lastChooseOpponentAction.playerId;
      remove(activePlayers, player => player._id == lastPlayerId);
    }

    return first(sortBy(activePlayers, ["stash", "createdAt"]));
  }
}
