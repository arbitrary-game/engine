import ClassicRound from './ClassicRound'
import _ from 'lodash';

const MULTIPLIER = 2;

export default class X2Round extends ClassicRound {

  getDataSchema() {
    return new SimpleSchema({
      playerId: {
        type: String
      },
      stash: {
        type: Number
      },
      bet: {
        type: Number
      },
      stake: {
        type: Number
      },
      candidateId: {
        type: String,
        optional: true,
      },
      wasBuffed: {
        type: Boolean
      },
    })
  }

  calculatePower() {
    const candidateIds = _.groupBy(this.data, (i) => i.candidateId);
    for (const row of this.data) {
      if (candidateIds[row.playerId]) {
        row.power = _.sumBy(candidateIds[row.playerId], (i) => i.wasBuffed? i.stake * MULTIPLIER: i.stake);
      } else {
        row.power = 0;
      }
    }
  }

}
