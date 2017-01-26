'use strict';
/* eslint-env mocha */
import {should} from "meteor/practicalmeteor:chai";
import ClassicRuleset from "./ClassicRuleset";

/* activate */
should();

describe('ClassicRuleset', function() {
  const createActions = () => [
    {
      playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'
    },
  ];
  const createPlayers = () => [
    {
      _id: 'Alice'
    },
    {
      _id: 'Bob'
    },
    {
      _id: 'Winston'
    },
    {
      _id: 'Franklin'
    },
    {
      _id: 'Joseph'
    },
  ];
  // if no actions ChooseOpponent if one action  initiator should Raise, then Alice should Raise

  it('First pending action should be "ChooseOpponent"', function() {
    const createRuleset = (actions = [], players = createPlayers(), initiator = 'Joseph') => new ClassicRuleset(actions, players, initiator);
    const ruleset = createRuleset();
    const state = ruleset.getState();
    console.log('state', state);
    state.pendingActions.should.be.deep.equal([
      {playerId: 'Joseph', type: 'ChooseOpponent'}
    ]);
  });

  it('Second pending action should be "Raise"', function() {
    const createRuleset = (actions = createActions(), players = createPlayers()) => new ClassicRuleset(actions, players);
    const ruleset = createRuleset();
    const state = ruleset.getState();
    state.pendingActions.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 10}
    ]);
  });

});
