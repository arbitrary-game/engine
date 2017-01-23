'use strict';
/* eslint-env mocha */
import _ from 'lodash';
import {Meteor} from 'meteor/meteor';
import {expect} from 'meteor/practicalmeteor:chai';
import Round from './Round.js';

if (Meteor.isServer) {
  const createParams = () => [
    {
      player: 'Alice', stash: 500, bet: 100, stake: 300, vote: 'Alice'
    },
    {
      player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
    },
    {
      player: 'Winston', stash: 500, bet: 0, stake: 400, vote: 'Bob'
    },
    {
      player: 'Franklin', stash: 500, bet: 0, stake: 500, vote: 'Bob'
    },
    {
      player: 'Stalin', stash: 500, bet: 0, stake: 10, vote: 'Bob'
    }
  ];
  const createRound = () => new Round(createParams());

  describe('Round type validations', function() {

    it('There should be more that one player', function() {
      expect(function() {
        let params = createParams();
        params = params.slice(0, 1);
        new Round(params);
      }).to.throw(Error, /should be more that one player/);
    });

    it('Players name should be String', function() {
      expect(function() {
        let params = createParams();
        params[0].player = 42;
        new Round(params);
      }).to.throw(Error, /Expected string, got number/);
    });

    it('Stash should be a Number', function() {
      try {
        new Round([
          {
            player: '500', stash: '500', bet: 100, stake: 300, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ]);
        throw 'Exception anyway!'
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Expected number, got string in field [0].stash");
      }
    });

    it('Bet should be a Number', function() {
      try {
        new Round([
          {
            player: '500', stash: 500, bet: '100', stake: 300, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ]);
        throw 'Exception anyway!'
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Expected number, got string in field [0].bet");
      }
    });

    it('Stake should be a Number', function() {
      try {
        new Round([
          {
            player: '500', stash: 500, bet: 100, stake: '300', vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ]);
        throw 'Exception anyway!'
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Expected number, got string in field [0].stake");
      }
    });

    it('Vote should be a Number', function() {
      try {
        new Round([
          {
            player: '500', stash: 500, bet: 100, stake: 300, vote: 1
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ])
        throw 'Exception anyway!'
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Expected string, got number in field [0].vote");
      }
    });

  });

  describe('Round logic validations', function() {

    it('Bet + Stake <= Stash', function() {
      try {
        new Round([
          {
            player: 'Alice', stash: 500, bet: 300, stake: 300, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ]);
        throw "Exception anyway!";
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Bet + Stake <= Stash");
      }
    });

    it('Players ids should be unique', function() {
      try {
        new Round([
          {
            player: 'Alice', stash: 500, bet: 100, stake: 300, vote: 'Alice'
          },
          {
            player: 'Alice', stash: 500, bet: 100, stake: 100, vote: 'Alice'
          }
        ]);
        throw "Exception anyway!"
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Players ids should be unique");
      }
    });

    it('Votes are for valid players', function() {
      try {
        new Round([
          {
            player: 'Alice', stash: 500, bet: 100, stake: 300, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Sam'
          }
        ])
        throw "Exception anyway!"
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Votes must be for valid players");
      }
    });

    it('Minimal bet is 10 coins', function() {
      try {
        new Round([
          {
            player: 'Alice', stash: 500, bet: 1, stake: 300, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ])
        throw "Exception anyway!"
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Minimal bet is 10 coins");
      }
    });

    it('Minimal stake is 10 coins', function() {
      try {
        new Round([
          {
            player: 'Alice', stash: 500, bet: 11, stake: 1, vote: 'Alice'
          },
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          }
        ])
        throw "Exception anyway!"
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Minimal stake is 10 coins");
      }
    });

    it('Only two players place bets', function() {
      try {
        new Round([
          {
            player: 'Bob', stash: 500, bet: 100, stake: 100, vote: 'Bob 1'
          },
          {
            player: 'Bob 1', stash: 500, bet: 100, stake: 100, vote: 'Bob 2'
          },
          {
            player: 'Bob 2', stash: 500, bet: 100, stake: 100, vote: 'Bob'
          },
        ])
        throw "Exception anyway!"
      } catch (e) {
        expect(e.message).to.be.equal("Match error: Only two players place bets");
      }
    });

  });

  describe('Round with default rules', function() {

    it('calculatePower', function() {
      const round = createRound();
      round.calculatePower();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('power');
      }
    });

    it('calculateWinner', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('winner');
      }
      expect(result[0].winner).to.be.equal(false);
      expect(result[1].winner).to.be.equal(true);
      expect(result[2].winner).to.be.equal(null);
    });

    it('calculateMajority', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('majority');
      }
      expect(result[0].majority).to.be.equal(false);
      expect(result[1].majority).to.be.equal(true);
      expect(result[2].majority).to.be.equal(true);
    });

    it('calculateShare', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('share');
      }
      expect(result[0].share).to.be.equal(-1);
      expect(result[1].share).to.be.equal(0.1);
      expect(result[2].share).to.be.equal(0.4);
      expect(result[3].share).to.be.equal(0.5);
      expect(result[4].share).to.be.equal(0.01);
    });

    it('calculateScalp', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('scalp');
      }
      expect(result[0].scalp).to.be.equal(-300);
      expect(result[1].scalp).to.be.equal(30);
      expect(result[2].scalp).to.be.equal(120);
      expect(result[3].scalp).to.be.equal(150);
      expect(result[4].scalp).to.be.equal(3);
    });

    it('calculatePrize', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('prize');
      }
      expect(result[0].prize).to.be.equal(-100);
      expect(result[1].prize).to.be.equal(100);
      expect(result[2].prize).to.be.equal(0);
      expect(result[3].prize).to.be.equal(0);
      expect(result[4].prize).to.be.equal(0);
    });

    it('calculateFix', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      round.calculateFix();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('fix');
      }
      expect(result[0].fix).to.be.equal(-3);
      expect(result[1].fix).to.be.equal(0);
      expect(result[2].fix).to.be.equal(0);
      expect(result[3].fix).to.be.equal(0);
      expect(result[4].fix).to.be.equal(0);
    });

    it('calculateTotal', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      round.calculateFix();
      round.calculateTotal();
      const result = round.params;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('total');
      }
      expect(result[0].total).to.be.equal(97);
      expect(result[1].total).to.be.equal(630);
      expect(result[2].total).to.be.equal(620);
      expect(result[3].total).to.be.equal(650);
      expect(result[4].total).to.be.equal(503);
    });

    it('calculate', function() {
      const round = createRound();
      const result = round.calculate();
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('power');
        expect(row).to.have.property('winner');
        expect(row).to.have.property('majority');
        expect(row).to.have.property('share');
        expect(row).to.have.property('scalp');
        expect(row).to.have.property('prize');
        expect(row).to.have.property('fix');
        expect(row).to.have.property('total');

        expect(row.bet + row.stake).to.be.at.most(row.stash);
      }
      const totalRound = _.sumBy(result, i => i.total);
      const previousTotal = _.sumBy(result, i => i.stash);
      expect(totalRound).to.be.equal(previousTotal);
    });

  });

}
