'use strict';
/* eslint-env mocha */
import {should} from "meteor/practicalmeteor:chai";
import ClassicRuleset from "./ClassicRuleset";
import {find} from "lodash";

/* activate */
should();

describe('ClassicRuleset', function() {
  let players = undefined;
  let actions = [];

  const createPlayers = () => [
    {
      _id: 'Alice',
      stash: 500
    },
    {
      _id: 'Bob',
      stash: 500
    },
    {
      _id: 'Winston',
      stash: 500
    },
    {
      _id: 'Franklin',
      stash: 500
    },
    {
      _id: 'Joseph',
      stash: 500
    },
  ];

  this.beforeEach(function () {
    actions = [];
    players = createPlayers();
  });

  const createChooseOpponentAction = (playerId, opponentId) => ({type: 'ChooseOpponent', playerId, opponentId});
  const createRaiseAction = (playerId, amount) => ({type: 'Raise', playerId, amount});
  const createStakeAction = (playerId, amount) => ({type: 'Stake', playerId, amount});
  const createVoteAction = (playerId, candidateId) => ({type: 'Vote', playerId, candidateId});

  it('should provide no messages and a pending action "ChooseOpponent" at the beginning of the game', function() {
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent'}
    ]);
    messages.should.be.deep.equal([]);
  });

  it('should provide the message "ChooseOpponent" and a pending action "Raise" after the opponent has been chosen', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 10}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'}
    ]);
  });

  it('should provide messages ["ChooseOpponent", "Raise"] and a pending action "Raise" for Bob after the first Raise has been made with minimal bet set', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'Raise', amount: 30}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30}
    ]);
  });

  it('should provide messages ["ChooseOpponent", "Raise", "Raise"] and a pending action "Raise" for Alice after Bob has raised the bet', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 50));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 50}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 50}
    ]);
  });

  it('should start Staking for all players after the final bet is set', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Stake', amount: 10},
      {playerId: 'Bob', type: 'Stake', amount: 10},
      {playerId: 'Winston', type: 'Stake', amount: 10},
      {playerId: 'Franklin', type: 'Stake', amount: 10},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 30}
    ]);
  });

  it('should provide some "Stake" actions after a few players have made their stakes', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 100));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Stake', amount: 10},
      {playerId: 'Franklin', type: 'Stake', amount: 10},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 100}
    ]);
  });

  it('should start Voting for all players after the each player has made his stake', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 100));
    actions.push(createStakeAction('Franklin', 100));
    actions.push(createStakeAction('Joseph', 10));
    actions.push(createStakeAction('Alice', 50));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Vote'},
      {playerId: 'Bob', type: 'Vote'},
      {playerId: 'Winston', type: 'Vote'},
      {playerId: 'Franklin', type: 'Vote'},
      {playerId: 'Joseph', type: 'Vote'},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 100},
      {playerId: 'Franklin', type: 'Stake', amount: 100},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
      {playerId: 'Alice', type: 'Stake', amount: 50},
    ]);
  });

  it('should provide some "Vote" actions after a few players have spent their votes', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 100));
    actions.push(createStakeAction('Franklin', 100));
    actions.push(createStakeAction('Joseph', 10));
    actions.push(createStakeAction('Alice', 50));
    actions.push(createVoteAction('Bob', 'Bob'));
    actions.push(createVoteAction('Winston', 'Bob'));
    actions.push(createVoteAction('Franklin', 'Alice'));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Vote'},
      {playerId: 'Joseph', type: 'Vote'},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 100},
      {playerId: 'Franklin', type: 'Stake', amount: 100},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      {playerId: 'Bob', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Winston', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Franklin', type: 'Vote', candidateId: 'Alice'},
    ]);
  });

  it('should provide a pending action "ChooseOpponent" when all votes have been spent', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 50));
    actions.push(createStakeAction('Franklin', 50));
    actions.push(createStakeAction('Joseph', 50));
    actions.push(createStakeAction('Alice', 50));
    actions.push(createVoteAction('Bob', 'Bob'));
    actions.push(createVoteAction('Winston', 'Bob'));
    actions.push(createVoteAction('Franklin', 'Alice'));
    actions.push(createVoteAction('Alice', 'Alice'));
    actions.push(createVoteAction('Joseph', 'Alice'));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();
    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'ChooseOpponent'}
    ]);

    // drop composite message here to simplify validation
    messages.slice(0, 13).should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 50},
      {playerId: 'Franklin', type: 'Stake', amount: 50},
      {playerId: 'Joseph', type: 'Stake', amount: 50},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      {playerId: 'Bob', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Winston', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Franklin', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Alice', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Joseph', type: 'Vote', candidateId: 'Alice'},
    ]);

    // check if the composite message is provided
    messages.length.should.be.equal(14);
  });

  it('should update players stashes after the round is finished', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 50));
    actions.push(createStakeAction('Franklin', 50));
    actions.push(createStakeAction('Joseph', 50));
    actions.push(createStakeAction('Alice', 50));
    actions.push(createVoteAction('Bob', 'Bob'));
    actions.push(createVoteAction('Winston', 'Bob'));
    actions.push(createVoteAction('Franklin', 'Alice'));
    actions.push(createVoteAction('Alice', 'Alice'));
    actions.push(createVoteAction('Joseph', 'Alice'));
    const ruleset = new ClassicRuleset(actions, players);
    ruleset.getState();

    find(players, {_id: "Alice"}).stash.should.be.equal(500 + 30/*bet*/ + 33/*scalp*/);
    find(players, {_id: "Bob"}).stash.should.be.equal(500 - 30/*bet*/ - 50/*stake*/);
    find(players, {_id: "Winston"}).stash.should.be.equal(500 - 50/*scalp*/);
    find(players, {_id: "Joseph"}).stash.should.be.equal(500 + 33/*scalp*/);
    find(players, {_id: "Franklin"}).stash.should.be.equal(500 + 33/*scalp*/);
  });
});
