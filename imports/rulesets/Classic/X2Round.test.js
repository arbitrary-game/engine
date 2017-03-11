'use strict';
/* eslint-env mocha */
import _ from 'lodash';
import {Meteor} from 'meteor/meteor';
import {expect} from 'meteor/practicalmeteor:chai';
import X2Ruleset from './X2Ruleset';
import X2Round from './X2Round';

if (Meteor.isServer) {
  const createData = () => [
    {
      playerId: 'Alice', stash: 500, bet: 200, stake: 300, candidateId: 'Alice', wasBuffed: false
    },
    {
      playerId: 'Bob', stash: 500, bet: 200, stake: 300, candidateId: 'Bob', wasBuffed: true
    },
    {
      playerId: 'Winston', stash: 500, bet: 0, stake: 400, candidateId: 'Alice', wasBuffed: false
    },
  ];
  const createRound = (data = createData()) => new X2Round(new X2Ruleset(), data);

  describe('Round with X2 rules', function() {

    it('calculatePower', function() {
      const round = createRound();
      round.calculatePower();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('power');
      }
    });

    it('calculateWinner', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('winner');
      }
      expect(result[0].winner).to.be.equal(true);
      expect(result[1].winner).to.be.equal(false);
      expect(result[2].winner).to.be.equal(null);
    });

    it('calculateMajority', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('majority');
      }
      expect(result[0].majority).to.be.equal(true);
      expect(result[1].majority).to.be.equal(false);
      expect(result[2].majority).to.be.equal(true);
    });

    it('calculateShare', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('share');
      }
      expect(result[0].share).to.be.equal(0.43);
      expect(result[1].share).to.be.equal(-1);
      expect(result[2].share).to.be.equal(0.57);
    });

    it('calculateScalp', function() {
      const round = createRound();
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('scalp');
      }
      expect(result[0].scalp).to.be.equal(129);
      expect(result[1].scalp).to.be.equal(-300);
      expect(result[2].scalp).to.be.equal(170);
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
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('prize');
      }
      expect(result[0].prize).to.be.equal(200);
      expect(result[1].prize).to.be.equal(-200);
      expect(result[2].prize).to.be.equal(0);
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
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('fix');
      }
      expect(result[0].fix).to.be.equal(1);
      expect(result[1].fix).to.be.equal(0);
      expect(result[2].fix).to.be.equal(0);
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
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('total');
      }
      expect(result[0].total).to.be.equal(830);
      expect(result[1].total).to.be.equal(0);
      expect(result[2].total).to.be.equal(670);
    });

    it('calculate', function() {
      const round = createRound();
      const result = round.calculate();
      expect(result.length).to.be.equal(3);
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

    it('calculateTotal buffed player wins', function() {
      const round = createRound();
      // this means Bob will win (300*2 > 200 + 300)
      round.data[2].stake = 200;
      round.calculatePower();
      round.calculateWinner();
      round.calculateMajority();
      round.calculateShare();
      round.calculateScalp();
      round.calculatePrize();
      round.calculateFix();
      round.calculateTotal();
      const result = round.data;
      expect(result.length).to.be.equal(3);
      for (const row of result) {
        expect(row).to.have.property('total');
      }
      expect(result[0].total).to.be.equal(0); // -200 -300
      expect(result[1].total).to.be.equal(1200); //200 + 500
      expect(result[2].total).to.be.equal(300); // - 200
    });

  });

}
