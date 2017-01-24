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
    let round = createRound(players, ruleset);

    let previousAction;
    for (const action of actions) {
      switch (action.type) {
        case "ChooseOpponent":
          pendingActions = [];
          pendingActions.push({
            type: "Raise",
            amount: ruleset.getMinimalBetAmount(),
            playerId: action.playerId
          });
          break;
        case "Raise":
          if (action.amount > previousAction.amount) {
            const opponent = find(round, (info) => info.bet && info.playerId != action.playerId);
            pendingActions = [];
            pendingActions.push({
              type: "Raise",
              amount: action.amount,
              playerId: opponent.playerId
            });
          } else {
            let playerA = find(round, {playerId: action.playerId});
            let playerB = find(round, {playerId: previousAction.playerId});
            playerA.bet = playerB.bet = action.amount;
            pendingActions = [];
            for (const player of players) {
              pendingActions.push({
                type: "Stake",
                amount: ruleset.getMinimalStakeAmount(),
                playerId: player._id
              });
            }
          }
          break;
        case "Stake":
          let pendingActions = without(pendingActions, (pendingAction) => pendingAction.playerId === action.playerId);
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

  createRound(players) {
    let round = [];
    for (let player of players) {
      round.push({
        playerId: player._id,
        stash: 0,
        bet: 0,
        stake: 0,
        votedForPlayerId: "",
      });
    }
    return round;
  }
}
