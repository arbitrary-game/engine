'use strict';
/* eslint-env mocha */
import {should} from "meteor/practicalmeteor:chai";
import ClassicRuleset from "./ClassicRuleset";
import {last, find, remove} from "lodash";

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

  this.beforeEach(function() {
    actions = [];
    players = createPlayers();
  });

  const createChooseOpponentAction = (playerId, opponentId) => ({type: 'ChooseOpponent', playerId, opponentId});
  const createRaiseAction = (playerId, amount) => ({type: 'Raise', playerId, amount});
  const createStakeAction = (playerId, amount) => ({type: 'Stake', playerId, amount});
  const createVoteAction = (playerId, candidateId) => ({type: 'Vote', playerId, candidateId});
  const createTransferAction = (playerId, receiverId, amount) => ({type: 'Transfer', playerId, receiverId, amount});
  const generateFullGameData = () => {
    players = [
      {
        _id: 'Denis',
        stash: 500
      },
      {
        _id: 'Aleksandr',
        stash: 500
      },
      {
        _id: 'Alexey',
        stash: 500
      },
      {
        _id: 'Jack',
        stash: 500
      },
      {
        _id: 'Max',
        stash: 500
      },
    ];

    // round 1
    actions.push(createChooseOpponentAction('Max', 'Jack'));
    actions.push(createRaiseAction('Max', 75));
    actions.push(createRaiseAction('Jack', 75));

    actions.push(createStakeAction('Denis', 200));
    actions.push(createStakeAction('Aleksandr', 450));
    actions.push(createStakeAction('Alexey', 400));
    actions.push(createStakeAction('Jack', 200));
    actions.push(createStakeAction('Max', 100));

    actions.push(createVoteAction('Denis', 'Jack'));
    actions.push(createVoteAction('Aleksandr', 'Max'));
    actions.push(createVoteAction('Alexey', 'Jack'));
    actions.push(createVoteAction('Jack', 'Jack'));
    actions.push(createVoteAction('Max', 'Max'));

    // round 2
    actions.push(createChooseOpponentAction('Aleksandr', 'Alexey'));
    actions.push(createRaiseAction('Aleksandr', 50));
    actions.push(createRaiseAction('Alexey', 50));

    actions.push(createStakeAction('Denis', 500));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 400));
    actions.push(createStakeAction('Jack', 712));
    actions.push(createStakeAction('Max', 150));

    actions.push(createVoteAction('Denis', 'Aleksandr'));
    actions.push(createVoteAction('Aleksandr', 'Aleksandr'));
    actions.push(createVoteAction('Alexey', 'Aleksandr'));
    actions.push(createVoteAction('Jack', 'Alexey'));
    actions.push(createVoteAction('Max', 'Aleksandr'));

    // round 3
    actions.push(createChooseOpponentAction('Aleksandr', 'Denis'));
    actions.push(createRaiseAction('Aleksandr', 101));
    actions.push(createRaiseAction('Denis', 101));

    actions.push(createStakeAction('Denis', 10));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 995));
    actions.push(createStakeAction('Jack', 0));
    actions.push(createStakeAction('Max', 200));

    actions.push(createVoteAction('Denis', 'Denis'));
    actions.push(createVoteAction('Aleksandr', 'Aleksandr'));
    actions.push(createVoteAction('Alexey', 'Aleksandr'));
    actions.push(createVoteAction('Jack', 'Aleksandr'));
    actions.push(createVoteAction('Max', 'Aleksandr'));

    actions.push(createTransferAction('Denis', 'Jack', 200));

    // round 4
    actions.push(createChooseOpponentAction('Jack', 'Alexey'));
    actions.push(createRaiseAction('Jack', 200));
    actions.push(createRaiseAction('Alexey', 200));

    actions.push(createStakeAction('Denis', 600));
    actions.push(createStakeAction('Aleksandr', 10));
    actions.push(createStakeAction('Alexey', 10));
    actions.push(createStakeAction('Jack', 0));
    actions.push(createStakeAction('Max', 150));

    actions.push(createVoteAction('Denis', 'Jack'));
    actions.push(createVoteAction('Aleksandr', 'Alexey'));
    actions.push(createVoteAction('Alexey', 'Jack'));
    actions.push(createVoteAction('Jack', 'Jack'));
    actions.push(createVoteAction('Max', 'Jack'));

    // round 5
    actions.push(createChooseOpponentAction('Aleksandr', 'Alexey'));
    actions.push(createRaiseAction('Aleksandr', 192));
    actions.push(createRaiseAction('Alexey', 192));

    actions.push(createStakeAction('Denis', 400));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 400));
    actions.push(createStakeAction('Jack', 400));
    actions.push(createStakeAction('Max', 200));

    actions.push(createVoteAction('Denis', 'Alexey'));
    actions.push(createVoteAction('Aleksandr', 'Aleksandr'));
    actions.push(createVoteAction('Alexey', 'Alexey'));
    actions.push(createVoteAction('Jack', 'Alexey'));
    actions.push(createVoteAction('Max', 'Aleksandr'));

    actions.push(createTransferAction('Denis', 'Aleksandr', 150));

    // round 6
    actions.push(createChooseOpponentAction('Aleksandr', 'Denis'));
    actions.push(createRaiseAction('Aleksandr', 150));
    actions.push(createRaiseAction('Denis', 150));

    actions.push(createStakeAction('Denis', 441));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 10));
    actions.push(createStakeAction('Jack', 466));
    actions.push(createStakeAction('Max', 230));

    actions.push(createVoteAction('Denis', 'Denis'));
    actions.push(createVoteAction('Aleksandr', 'Aleksandr'));
    actions.push(createVoteAction('Alexey', 'Denis'));
    actions.push(createVoteAction('Jack', 'Aleksandr'));
    actions.push(createVoteAction('Max', 'Denis'));

    // round 7
    actions.push(createChooseOpponentAction('Alexey', 'Max'));
    actions.push(createRaiseAction('Alexey', 388));
    actions.push(createRaiseAction('Max', 388));

    actions.push(createStakeAction('Denis', 1043));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 10));
    actions.push(createStakeAction('Jack', 0));
    actions.push(createStakeAction('Max', 0));

    actions.push(createVoteAction('Denis', 'Max'));
    actions.push(createVoteAction('Aleksandr', 'Max'));
    actions.push(createVoteAction('Alexey', 'Max'));
    actions.push(createVoteAction('Jack', 'Max'));
    actions.push(createVoteAction('Max', 'Max'));

    // round 8
    actions.push(createChooseOpponentAction('Alexey', 'Max'));
    actions.push(createRaiseAction('Alexey', 681));
    actions.push(createRaiseAction('Max', 681));

    actions.push(createStakeAction('Denis', 1043));
    actions.push(createStakeAction('Aleksandr', 0));
    actions.push(createStakeAction('Alexey', 0));
    actions.push(createStakeAction('Jack', 0));
    actions.push(createStakeAction('Max', 10));

    actions.push(createVoteAction('Denis', 'Max'));
    actions.push(createVoteAction('Aleksandr', 'Max'));
    actions.push(createVoteAction('Alexey', 'Max'));
    actions.push(createVoteAction('Jack', 'Max'));
    actions.push(createVoteAction('Max', 'Max'));
  };


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
      {playerId: 'Alice', type: 'Stake', amount: 0},
      {playerId: 'Bob', type: 'Stake', amount: 0},
      {playerId: 'Winston', type: 'Stake', amount: 0},
      {playerId: 'Franklin', type: 'Stake', amount: 0},
      {playerId: 'Joseph', type: 'Stake', amount: 0},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Call', amount: 30},
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
      {playerId: 'Alice', type: 'Stake', amount: 0},
      {playerId: 'Franklin', type: 'Stake', amount: 0},
      {playerId: 'Joseph', type: 'Stake', amount: 0},
    ]);
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
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

    // filter round result message to simplify validation
    const results = remove(messages, message => !message.playerId);
    console.log(results)
    results.length.should.be.equal(1);

    // drop composite message here to simplify validation
    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
      {playerId: 'Bob', type: 'Check'},
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

    for (let action of actions) {
      action.createdAt = new Date();
    }

    const ruleset = new ClassicRuleset(actions, players);
    const {messages} = ruleset.getState();
    const round = find(messages, message => !message.playerId);

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
    const ruleset = new ClassicRuleset(actions, players);
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
    actions.push(createChooseOpponentAction('Bob', 'Winston'));
    actions.push(createRaiseAction('Bob', 100));
    actions.push(createRaiseAction('Winston', 150));
    actions.push(createRaiseAction('Bob', 150));
    actions.push(createStakeAction('Franklin', 50));
    actions.push(createStakeAction('Alice', 50));
    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // filter round result message to simplify validation
    remove(messages, message => !message.playerId);

    expectations.should.be.deep.equal([
      {playerId: 'Bob', type: 'Stake', amount: 10},
      {playerId: 'Winston', type: 'Stake', amount: 10},
      {playerId: 'Joseph', type: 'Stake', amount: 10},
    ]);

    messages.should.be.deep.equal([
      {playerId: 'Alice', type: 'ChooseOpponent', opponentId: 'Bob'},
      {playerId: 'Alice', type: 'Raise', amount: 30},
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
      {playerId: 'Bob', type: 'ChooseOpponent', opponentId: 'Winston'},
      {playerId: 'Bob', type: 'Raise', amount: 100},
      {playerId: 'Winston', type: 'Raise', amount: 150},
      {playerId: 'Winston', type: 'Call', amount: 150},
      {playerId: 'Franklin', type: 'Stake', amount: 50},
      {playerId: 'Alice', type: 'Stake', amount: 50},
    ]);

  });

  it('should process the whole game correctly', function() {
    generateFullGameData();

    const ruleset = new ClassicRuleset(actions, players);
    const {expectations, messages} = ruleset.getState();

    // filter round result messages to simplify validation
    const results = remove(messages, message => !message.playerId);

    // expectations.should.be.deep.equal([
    //   {playerId: 'Denis', type: 'ChooseOpponent'}
    // ]);

    const standard = [
      // round 1
      {playerId: 'Max', type: 'ChooseOpponent', opponentId: 'Jack'},
      {playerId: 'Max', type: 'Raise', amount: 75},
      {playerId: 'Jack', type: 'Call', amount: 75},

      {playerId: 'Denis', type: 'Stake', amount: 200},
      {playerId: 'Aleksandr', type: 'Stake', amount: 450},
      {playerId: 'Alexey', type: 'Stake', amount: 400},
      {playerId: 'Jack', type: 'Stake', amount: 200},
      {playerId: 'Max', type: 'Stake', amount: 100},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Max'},

      // round 2
      {playerId: 'Aleksandr', type: 'ChooseOpponent', opponentId: 'Alexey'},
      {playerId: 'Aleksandr', type: 'Raise', amount: 50},
      {playerId: 'Alexey', type: 'Call', amount: 50},

      {playerId: 'Denis', type: 'Stake', amount: 500},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 400},
      {playerId: 'Jack', type: 'Stake', amount: 712},
      {playerId: 'Max', type: 'Stake', amount: 150},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Alexey'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Aleksandr'},


      // round 3 v
      {playerId: 'Aleksandr', type: 'ChooseOpponent', opponentId: 'Denis'},
      {playerId: 'Aleksandr', type: 'Raise', amount: 101},
      {playerId: 'Denis', type: 'Call', amount: 101},

      {playerId: 'Denis', type: 'Stake', amount: 10},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 995},
      {playerId: 'Jack', type: 'Stake', amount: 0},
      {playerId: 'Max', type: 'Stake', amount: 200},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Denis'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Aleksandr'},

      {playerId: 'Denis', type: 'Transfer', receiverId: 'Jack', amount: 200},
      // round 4 v
      {playerId: 'Jack', type: 'ChooseOpponent', opponentId: 'Alexey'},
      {playerId: 'Jack', type: 'Raise', amount: 200},
      {playerId: 'Alexey', type: 'Call', amount: 200},

      {playerId: 'Denis', type: 'Stake', amount: 600},
      {playerId: 'Aleksandr', type: 'Stake', amount: 10},
      {playerId: 'Alexey', type: 'Stake', amount: 10},
      {playerId: 'Jack', type: 'Stake', amount: 0},
      {playerId: 'Max', type: 'Stake', amount: 150},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Alexey'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Jack'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Jack'},

      // round 5 v
      {playerId: 'Aleksandr', type: 'ChooseOpponent', opponentId: 'Alexey'},
      {playerId: 'Aleksandr', type: 'Raise', amount: 192},
      {playerId: 'Alexey', type: 'Call', amount: 192},

      {playerId: 'Denis', type: 'Stake', amount: 400},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 400},
      {playerId: 'Jack', type: 'Stake', amount: 400},
      {playerId: 'Max', type: 'Stake', amount: 200},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Alexey'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Alexey'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Alexey'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Aleksandr'},

      {type: 'Transfer', playerId: 'Denis', receiverId: 'Aleksandr', amount: 150},

      // round 6 v
      {playerId: 'Aleksandr', type: 'ChooseOpponent', opponentId: 'Denis'},
      {playerId: 'Aleksandr', type: 'Raise', amount: 150},
      {playerId: 'Denis', type: 'Call', amount: 150},

      {playerId: 'Denis', type: 'Stake', amount: 441},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 10},
      {playerId: 'Jack', type: 'Stake', amount: 466},
      {playerId: 'Max', type: 'Stake', amount: 230},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Denis'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Denis'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Aleksandr'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Denis'},

      // round 7 v
      {playerId: 'Alexey', type: 'ChooseOpponent', opponentId: 'Max'},
      {playerId: 'Alexey', type: 'Raise', amount: 388},
      {playerId: 'Max', type: 'Call', amount: 388},

      {playerId: 'Denis', type: 'Stake', amount: 1043},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 10},
      {playerId: 'Jack', type: 'Stake', amount: 0},
      {playerId: 'Max', type: 'Stake', amount: 0},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Max'},

      // round 8 v
      {playerId: 'Alexey', type: 'ChooseOpponent', opponentId: 'Max'},
      {playerId: 'Alexey', type: 'Raise', amount: 681},
      {playerId: 'Max', type: 'Call', amount: 681},

      {playerId: 'Denis', type: 'Stake', amount: 1043},
      {playerId: 'Aleksandr', type: 'Stake', amount: 0},
      {playerId: 'Alexey', type: 'Stake', amount: 0},
      {playerId: 'Jack', type: 'Stake', amount: 0},
      {playerId: 'Max', type: 'Stake', amount: 10},
      { createdAt: undefined, type: 'Check' },

      {playerId: 'Denis', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Aleksandr', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Alexey', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Jack', type: 'Vote', candidateId: 'Max'},
      {playerId: 'Max', type: 'Vote', candidateId: 'Max'},

    ];

    messages.forEach((item, index) => {
      item.should.be.deep.equal(standard[index])
    });

    messages.should.be.deep.equal(standard);
  });

  it('should provide correct final GameFinished message', function() {
    generateFullGameData();

    for (let action of actions) {
      action.createdAt = new Date();
    }

    const ruleset = new ClassicRuleset(actions, players);
    const {messages} = ruleset.getState();

    const gameFinishedMessage = find(messages, result => result.type == "Finish");
    expect(gameFinishedMessage).to.have.property("createdAt");
    expect(gameFinishedMessage).to.have.property("winner");
    expect(gameFinishedMessage.createdAt).to.be.an.instanceOf(Date);
    expect(gameFinishedMessage.winner).to.be.an.instanceOf(Object);
  });
});
