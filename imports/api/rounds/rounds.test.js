'use strict';
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';

import Round from './rounds.js';

if (Meteor.isServer) {
  // describe('Rounds calulate', () => {
  //     const round = new Round([
  //       {
  //         player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
  //       },
  //       {
  //         player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
  //       },
  //       {
  //         player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
  //       },
  //       {
  //         player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
  //       },
  //       {
  //         player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
  //       }
  //     ]);
  //
  //     it('Report calculate', () => {
  //       const result = round.calculate();
  //       expect(result.length).to.equal(5);
  //       for (const row of result) {
  //         expect(row).to.have.property('power');
  //       }
  //
  //     });
  //   });

  describe('Rounds calculatePower', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculatePower', () => {
        round.calculatePower();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('power');
        }
      });
    });

  describe('Rounds calculateWinner', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculateWinner', () => {
        round.calculatePower();
        round.calculateWinner();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('winner');
        }
        expect(result[0].winner).to.equal(false);
        expect(result[1].winner).to.equal(true);
        expect(result[2].winner).to.equal(null);
      });
    });

  describe('Rounds calculateMajority()', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculateMajority', () => {
        round.calculatePower();
        round.calculateWinner();
        round.calculateMajority();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('majority');
        }
        expect(result[0].majority).to.equal(false);
        expect(result[1].majority).to.equal(true);
        expect(result[2].majority).to.equal(true);
      });
    });

  describe('Rounds calculateShare()', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculateShare', () => {
        round.calculatePower();
        round.calculateWinner();
        round.calculateMajority();
        round.calculateShare();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('share');
        }
        expect(result[0].share).to.equal(-1);
        expect(result[1].share).to.equal(0.1);
        expect(result[2].share).to.equal(0.4);
        expect(result[3].share).to.equal(0.5);
        expect(result[4].share).to.equal(0.01);
      });
    });

  describe('Rounds calculateScalp()', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculateScalp', () => {
        round.calculatePower();
        round.calculateWinner();
        round.calculateMajority();
        round.calculateShare();
        round.calculateScalp();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('scalp');
        }
        expect(result[0].scalp).to.equal(-300);
        expect(result[1].scalp).to.equal(30);
        expect(result[2].scalp).to.equal(120);
        expect(result[3].scalp).to.equal(150);
        expect(result[4].scalp).to.equal(3);
      });
    });

  describe('Rounds calculatePrice()', () => {
      const round = new Round([
        {
          player: 'a', stash: 500, bet: 100, stake: 300, vote: 'a'
        },
        {
          player: 'b', stash: 500, bet: 100, stake: 100, vote: 'b'
        },
        {
          player: 'c', stash: 500, bet: 0, stake: 400, vote: 'b'
        },
        {
          player: 'd', stash: 500, bet: 0, stake: 500, vote: 'b'
        },
        {
          player: 'e', stash: 500, bet: 0, stake: 10, vote: 'b'
        }
      ]);

      it('Report calculatePrize', () => {
        round.calculatePower();
        round.calculateWinner();
        round.calculateMajority();
        round.calculateShare();
        round.calculateScalp();
        round.calculatePrize();
        const result = round.roundParams;
        expect(result.length).to.equal(5);
        for (const row of result) {
          expect(row).to.have.property('prize');
        }
        expect(result[0].prize).to.equal(-100);
        expect(result[1].prize).to.equal(100);
        expect(result[2].prize).to.equal(0);
        expect(result[3].prize).to.equal(0);
        expect(result[4].prize).to.equal(0);
      });
    });
}
