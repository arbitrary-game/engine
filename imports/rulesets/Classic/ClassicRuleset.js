import {last, find, without} from "lodash";
import ClassicRound from './ClassicRound';

export default class ClassicRuleset {
  constructor(actions, players) {
    this.actions = actions;
    this.players = players;
  }

  getState() {
    let pendingActions = [];
    let rounds = [];
    let round = this.createRound();

    let previousAction;
    for (let action of this.actions) {
      switch (action.type) {
        case "ChooseOpponent":
          pendingActions = [];
          pendingActions.push({
            playerId: action.playerId,
            type: "Raise",
            amount: this.getMinimalBetAmount(),
          });
          break;
        case "Raise":
          if (action.amount > previousAction.amount) {
            const opponent = find(round, (info) => info.bet && info.playerId != action.playerId);
            pendingActions = [];
            pendingActions.push({
              playerId: opponent.playerId,
              type: "Raise",
              amount: action.amount,
            });
          } else {
            let playerA = find(round, {playerId: action.playerId});
            let playerB = find(round, {playerId: previousAction.playerId});
            playerA.bet = playerB.bet = action.amount;
            pendingActions = [];
            for (const player of this.players) {
              pendingActions.push({
                type: "Stake",
                amount: this.getMinimalStakeAmount(),
                playerId: player._id
              });
            }
          }
          break;
        case "Stake":
          pendingActions = without(pendingActions, (pendingAction) => pendingAction.playerId === action.playerId);
          break;
        case "Vote":
          // if everybody voted, calculate round results & push the new round
          break;
        default:
          throw new Error(`Undefined action type: ${action.type}`);
          break;
      }
      previousAction = action;
    }

    // TODO: copy stashes into next round

    rounds.push(round);
    return {pendingActions, rounds};
  };

  createRound() {
    let round = new ClassicRound(this, []);
    for (let player of this.players) {
      round.data.push({
        playerId: player._id,
        stash: 0,
        bet: 0,
        stake: 0,
        votedForPlayerId: "",
      });
    }
    return round;
  }

  getMinimalBetAmount() {
    return 10;
  }

  getMinimalStakeAmount() {
    return 10;
  }

}
