import Actions from './ActionsCollection';
import Games from '../Games/GamesCollection';
import {GamesEnd} from "/imports/api/Games/GamesMethods";

Actions.after.insert((userId, action) => {
  const game =  Games.findOne(action.gameId);
  const ruleSet = game.ruleset();
  ruleSet.getState();
  const isFinished = ruleSet.isGameFinished();
  if (isFinished) {
    game.players().forEach( p => (  mixpanel.track("Player finished game", { distinct_id: p.userId, gameId: action.gameId}) ))
    // return money for players
    GamesEnd.call({gameId: game._id})
  }
});

