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
  const createRuleset = (actions = createActions(), players = createPlayers()) => new ClassicRuleset(actions, players);

  it('First pending action should be "ChooseOpponent"', function() {
    const ruleset = createRuleset();
    const state = ruleset.getState();
    state.pendingActions.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 10}
    ]);
  });

});
