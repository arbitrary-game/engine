'use strict';
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';

import Round from './rounds.js';

if (Meteor.isServer) {
  describe('Rounds calulate', () => {
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

      it('Report calculate', () => {
        const result = round.calculate();
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
        const result = round.calculateWinner();
      });
    });
}
