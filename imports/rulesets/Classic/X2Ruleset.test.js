'use strict';
/* eslint-env mocha */
import {should} from "meteor/practicalmeteor:chai";
import X2Ruleset from "./X2Ruleset";
import {filter, each, last, find, remove} from "lodash";
import moment from "moment";

/* activate */
should();

describe('X2Ruleset', function() {
  let players = undefined;
  let actions = [];

  const createPlayers = () => [
    {
      _id: 'Alice',
      stash: 500,
      createdAt: moment().add(1, 'h').toDate()
    },
    {
      _id: 'Bob',
      stash: 500,
      createdAt: moment().add(2, 'h').toDate()
    },
    {
      _id: 'Winston',
      stash: 500,
      createdAt: moment().add(3, 'h').toDate()
    },
    {
      _id: 'Franklin',
      stash: 500,
      createdAt: moment().add(4, 'h').toDate()
    },
    {
      _id: 'Joseph',
      stash: 500,
      createdAt: moment().add(5, 'h').toDate()
    },
  ];

  this.beforeEach(function() {
    actions = [];
    players = createPlayers();
  });

  const createChooseOpponentAction = (playerId, opponentId) => ({type: 'ChooseOpponent', playerId, opponentId});
  const createRaiseAction = (playerId, amount) => ({type: 'Raise', playerId, amount});
  const createStakeAction = (playerId, amount) => ({type: 'Stake', playerId, amount});
  const createVoteAction = (playerId, candidateId) => ({type: 'Vote', playerId, candidateId});
  const createBuffAction = (playerId, opponentId) => ({type: 'Buff', playerId, opponentId});

  it('should provide no messages and a pending action "ChooseOpponent" at the beginning of the game', function() {
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test the schema
    const {schema} = expectations[0];
    (() => schema.validate({opponentId: "Bob"})).should.not.throw();
    (() => schema.validate({opponentId: "Alice"})).should.throw();
    (() => schema.validate({opponentId: "Smith"})).should.throw();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', values: ["Bob", "Winston", "Franklin", "Joseph"]}
    ]);
    messages.should.be.deep.equal([]);
  });

  it('should provide the message "ChooseOpponent" and a pending action "Raise" after the opponent has been chosen', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test the schema
    const {schema} = expectations[0];
    (() => schema.validate({amount: 20})).should.not.throw();
    (() => schema.validate({amount: 550})).should.throw();
    (() => schema.validate({amount: 5})).should.throw();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 10, max: 500}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'}
    ]);
  });

  it('should provide messages ["ChooseOpponent", "Raise"] and a pending action "Raise" for Bob after the first Raise has been made with minimal bet set', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test the schema
    const {schema} = expectations[0];
    (() => schema.validate({amount: 30})).should.not.throw();
    (() => schema.validate({amount: 40})).should.not.throw();
    (() => schema.validate({amount: 500})).should.not.throw();
    (() => schema.validate({amount: 550})).should.throw();
    (() => schema.validate({amount: 20})).should.throw();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'Raise', amount: 30, max: 500}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30}
    ]);
  });

  it('should provide messages ["ChooseOpponent", "Offer", "Raise"] and a pending action "Raise" for Alice after Bob has raised the bet', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 50));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test the schema
    const {schema} = expectations[0];
    (() => schema.validate({amount: 50})).should.not.throw();
    (() => schema.validate({amount: 60})).should.not.throw();
    (() => schema.validate({amount: 500})).should.not.throw();
    (() => schema.validate({amount: 550})).should.throw();
    (() => schema.validate({amount: 40})).should.throw();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Raise', amount: 50, max: 500}
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Raise', amount: 50}
    ]);
  });

  it('should start Staking for all players after the final bet is set', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));

    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test some schemas
    {
      const {schema} = find(expectations, e => e.playerId == 'Alice');
      (() => schema.validate({amount: 50})).should.not.throw();
      (() => schema.validate({amount: 500})).should.throw();
      (() => schema.validate({amount: 5})).should.throw();
    }
    {
      const {schema} = find(expectations, e => e.playerId == 'Winston');
      (() => schema.validate({amount: 50})).should.not.throw();
      (() => schema.validate({amount: 500})).should.not.throw();
      (() => schema.validate({amount: 550})).should.throw();
      (() => schema.validate({amount: 5})).should.throw();
    }

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Stake', amount: 10, max: 470},
      {playerId: 'Bob', type: 'Stake', amount: 10, max: 470},
      {playerId: 'Winston', type: 'Stake', amount: 10, max: 500},
      {playerId: 'Franklin', type: 'Stake', amount: 10, max: 500},
      {playerId: 'Joseph', type: 'Stake', amount: 10, max: 500},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
    ]);
  });

  it('should NOT allow for player with no cash make a stake', function() {
    players[2].stash = 0; // Winston

    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));

    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Stake', amount: 10, max: 470},
      {playerId: 'Bob', type: 'Stake', amount: 10, max: 470},
      {playerId: 'Franklin', type: 'Stake', amount: 10, max: 500},
      {playerId: 'Joseph', type: 'Stake', amount: 10, max: 500},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
    ]);
  });

  it('should provide some "Stake" actions after a few players have made their stakes', function() {
    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Winston', 100));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Stake', amount: 10, max: 470},
      {playerId: 'Franklin', type: 'Stake', amount: 10, max: 500},
      {playerId: 'Joseph', type: 'Stake', amount: 10, max: 500},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
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
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // test any schema
    const {schema} = expectations[0];
    (() => schema.validate({candidateId: 'Alice'})).should.not.throw();
    (() => schema.validate({candidateId: 'Bob'})).should.not.throw();
    (() => schema.validate({candidateId: 'Winston'})).should.throw();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Bob', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Winston', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Franklin', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Joseph', type: 'Vote', values: ['Alice', 'Bob']},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 100},
      {playerId: 'Franklin', type: 'Stake', amount: 100},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      // TODO fix me)
      { createdAt: undefined, type: 'Check' }
    ]);
  });

  it('should NOT allow for player with no cash to vote', function() {
    players[2].stash = 0; // Winston

    actions.push(createChooseOpponentAction('Alice', 'Bob'));
    actions.push(createRaiseAction('Alice', 30));
    actions.push(createRaiseAction('Bob', 30));
    actions.push(createStakeAction('Bob', 50));
    actions.push(createStakeAction('Franklin', 100));
    actions.push(createStakeAction('Joseph', 10));
    actions.push(createStakeAction('Alice', 50));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Bob', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Franklin', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Joseph', type: 'Vote', values: ['Alice', 'Bob']},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Franklin', type: 'Stake', amount: 100},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      // TODO fix me)
      { createdAt: undefined, type: 'Check' }
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
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Vote', values: ['Alice', 'Bob']},
      {playerId: 'Joseph', type: 'Vote', values: ['Alice', 'Bob']},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 100},
      {playerId: 'Franklin', type: 'Stake', amount: 100},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      { createdAt: undefined, type: 'Check' },
      {playerId: 'Bob', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Winston', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Franklin', type: 'Vote', candidateId: 'Alice'},
    ]);
  });

  it('should provide a pending action "Buff" when all votes have been spent', function() {
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
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Alice', type: 'Buff', values: ["Bob", "Winston", "Franklin", "Joseph"]}
    ]);

    // filter round result message to simplify validation
    const results = remove(messages, message => message.type == "Round");
    results.length.should.be.equal(0);
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
    actions.push(createBuffAction('Alice', 'Franklin'));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'ChooseOpponent', values: ["Alice", "Winston", "Franklin", "Joseph"]}
    ]);

    // filter round result message to simplify validation
    const results = remove(messages, message => message.type == "Round");
    results.length.should.be.equal(1);

    // drop composite message here to simplify validation
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 50},
      {playerId: 'Franklin', type: 'Stake', amount: 50},
      {playerId: 'Joseph', type: 'Stake', amount: 50},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      { createdAt: undefined, type: 'Check' },
      {playerId: 'Bob', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Winston', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Franklin', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Alice', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Joseph', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Alice', type: 'Buff', opponentId: 'Franklin'},
    ]);
  });

  it('should provide formatted result of the round', function() {
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
    actions.push(createBuffAction('Alice', 'Franklin'));

    for (let action of actions) {
      action.createdAt = new Date();
    }

    const ruleset = new X2Ruleset(actions, players);
    const {messages} = ruleset.getState();
    const round = find(messages, message => message.type == "Round");

    expect(round).to.be.an.instanceof(Object);
    expect(round).to.have.property("createdAt");
    expect(round).to.have.property("result");
    expect(round.createdAt).to.be.an.instanceOf(Date);
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
    actions.push(createBuffAction('Alice', 'Joseph'));
    const ruleset = new X2Ruleset(actions, players);
    ruleset.getState();

    find(players, {_id: "Alice"}).stash.should.be.equal(500 + 30/*bet*/ + 33/*scalp*/ + 1/*fix*/);
    find(players, {_id: "Bob"}).stash.should.be.equal(500 - 30/*bet*/ - 50/*stake*/);
    find(players, {_id: "Winston"}).stash.should.be.equal(500 - 50/*scalp*/);
    find(players, {_id: "Joseph"}).stash.should.be.equal(500 + 33/*scalp*/);
    find(players, {_id: "Franklin"}).stash.should.be.equal(500 + 33/*scalp*/);
  });

  it('should provide correct values for the second round as well', function() {
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
    actions.push(createBuffAction('Alice', 'Joseph'));
    actions.push(createChooseOpponentAction('Bob', 'Winston'));
    actions.push(createRaiseAction('Bob', 100));
    actions.push(createRaiseAction('Winston', 150));
    actions.push(createRaiseAction('Bob', 150));
    actions.push(createStakeAction('Franklin', 50));
    actions.push(createStakeAction('Alice', 50));
    const ruleset = new X2Ruleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    each(expectations, e => delete e.schema);
    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'Stake', amount: 10, max: 270},
      {playerId: 'Winston', type: 'Stake', amount: 10, max: 300},
      {playerId: 'Joseph', type: 'Stake', amount: 10, max: 533},
    ]);

    // filter round result message to simplify validation
    remove(messages, message => message.type == "Round");

    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Offer', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
      {playerId: 'Bob', type: 'Stake', amount: 50},
      {playerId: 'Winston', type: 'Stake', amount: 50},
      {playerId: 'Franklin', type: 'Stake', amount: 50},
      {playerId: 'Joseph', type: 'Stake', amount: 50},
      {playerId: 'Alice', type: 'Stake', amount: 50},
      { createdAt: undefined, type: 'Check' },
      {playerId: 'Bob', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Winston', type: 'Vote', candidateId: 'Bob'},
      {playerId: 'Franklin', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Alice', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Joseph', type: 'Vote', candidateId: 'Alice'},
      {playerId: 'Alice', type: 'Buff', opponentId: 'Joseph'},
      {playerId: 'Bob', type: 'ChooseOpponent', opponentId: 'Winston'},
      {playerId: 'Bob', type: 'Offer', amount: 100},
      {playerId: 'Winston', type: 'Raise', amount: 150},
      {playerId: 'Bob', type: 'Call', amount: 150},
      {playerId: 'Franklin', type: 'Stake', amount: 50},
      {playerId: 'Alice', type: 'Stake', amount: 50},
    ]);

  });

});
