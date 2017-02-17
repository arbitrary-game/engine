'use strict';
/* eslint-env mocha */
import _ from 'lodash';
import {Meteor} from 'meteor/meteor';
import {expect} from 'meteor/practicalmeteor:chai';
import ClassicRuleset from './ClassicRuleset';
import ClassicRound from './ClassicRound';

if (Meteor.isServer) {
  const createData = () => [
    {
      playerId: 'Alice', stash: 500, bet: 100, stake: 300, candidateId: 'Alice'
    },
    {
      playerId: 'Bob', stash: 500, bet: 100, stake: 100, candidateId: 'Bob'
    },
    {
      playerId: 'Winston', stash: 500, bet: 0, stake: 400, candidateId: 'Bob'
    },
    {
      playerId: 'Franklin', stash: 500, bet: 0, stake: 500, candidateId: 'Bob'
    },
    {
      playerId: 'Stalin', stash: 500, bet: 0, stake: 10, candidateId: 'Bob'
    }
  ];
  const createRound = (data = createData()) => new ClassicRound(new ClassicRuleset(), data);

  describe('Round type validations', function() {

    it('There should be more that one player', function() {
      expect(function() {
        let data = createData();
        data = data.slice(0, 1);
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /should be more that one player/);
    });

    it('Players name should be String', function() {
      expect(function() {
        let data = createData();
        data[0].playerId = 42;
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /Expected string, got number/);
    });

    it('Stash should be a Number', function() {
      expect(function() {
        let data = createData();
        data[0].stash = "";
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /Expected number, got string/);
    });

    it('Bet should be a Number', function() {
      expect(function() {
        let data = createData();
        data[0].bet = "";
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /Expected number, got string/);
    });

    it('Stake should be a Number', function() {
      expect(function() {
        let data = createData();
        data[0].stake = "";
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /Expected number, got string/);
    });

    it('candidateId should be a String', function() {
      expect(function() {
        let data = createData();
        data[0].candidateId = 42;
        const round = createRound(data);
        round.validate()
      }).to.throw(Error, /Expected string, got number/);
    });

  });

  describe('Round logic validations', function() {

    it('Bet + Stake <= Stash', function() {
      expect(function() {
        let data = createData();
        data[0].bet = 400;
        data[0].stake = 400;
        data[0].stash = 500;
        const round = createRound(data);
        round.validate();
      }).to.throw(Error, /Bet \+ Stake <= Stash/);
    });

    it('Players ids should be unique', function() {
      expect(function() {
        let data = createData();
        data[0].playerId = "Alice";
        data[1].playerId = "Alice";
        const round = createRound(data);
        round.validate();
      }).to.throw(Error, /Players ids should be unique/);
    });

    it('Votes are for valid players', function() {
      expect(function() {
        let data = createData();
        data[0].candidateId = "Sam";
        const round = createRound(data);
        round.validate();
      }).to.throw(Error, /Votes must be for valid players/);
    });

    it('Minimal bet is 10 coins', function() {
      expect(function() {
        let data = createData();
        data[0].bet = 1;
        const round = createRound(data);
        round.validate();
      }).to.throw(Error, /Minimal bet is 10 coins/);
    });

    // it('Minimal stake is 10 coins', function() {
    //   expect(function() {
    //     let data = createData();
    //     data[0].stake = -1;
    //     const round = createRound(data);
    //     round.validate();
    //   }).to.throw(Error, /Minimal stake is 0 coins/);
    // });

    it('Only two players place bets', function() {
      expect(function() {
        let data = createData();
        data[2].bet = 100;
        const round = createRound(data);
        round.validate();
      }).to.throw(Error, /Only two players place bets/);
    });

  });

  describe('Round with default rules', function() {

    it('calculatePower', function() {
      const round = createRound();
      round.calculatePower();
      const result = round.data;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('power');
      }
    });

    it('calculateWinner', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      const result = round.data;
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
      const result = round.data;
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
      const result = round.data;
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
      const result = round.data;
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
      const result = round.data;
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
      const result = round.data;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('fix');
      }
      expect(result[0].fix).to.be.equal(0);
      expect(result[1].fix).to.be.equal(-3);
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
      const result = round.data;
      expect(result.length).to.be.equal(5);
      for (const row of result) {
        expect(row).to.have.property('total');
      }
      expect(result[0].total).to.be.equal(100);
      expect(result[1].total).to.be.equal(627);
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

    it('should refund bets and stakes if majority is not determined', function() {
      let data = createData();
      data[1].stake = 75;
      data[2].stake = 75;
      data[3].stake = 75;
      data[4].stake = 75;

      const round = createRound(data);
      const result = round.calculate();
      expect(result[0].total).to.be.equal(500);
      expect(result[1].total).to.be.equal(500);
      expect(result[2].total).to.be.equal(500);
      expect(result[3].total).to.be.equal(500);
      expect(result[4].total).to.be.equal(500);
    });

  });

}
