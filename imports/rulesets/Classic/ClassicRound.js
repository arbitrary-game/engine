import {Match, check} from 'meteor/check';
import _ from 'lodash';

export default class ClassicRound {
  constructor(ruleset, data) {
    this.ruleset = ruleset;
    this.data = data;
  }

  validate() {
    data = this.data;

    check(data, [Object]);
    check(data, [
      {
        playerId: String,
        stash: Number,
        bet: Number,
        stake: Number,
        candidateId: String,
      }
    ]);

    if (data.length < 2) {
      throw new Match.Error('There should be more that one player');
    }

    if (!_.every(data, (row) => (row.bet + row.stake) <= row.stash)) {
      throw new Match.Error('Bet + Stake <= Stash');
    }

    const playersIds = data.map(i => i.playerId);
    const playersIdsUnique = _.uniqBy(data, 'playerId').map(i => i.playerId);
    if ((_.difference(playersIds, playersIdsUnique).length > 0) || playersIds.length != playersIdsUnique.length) {
      throw new Match.Error('Players ids should be unique');
    }

    if (_.difference(_.uniqBy(data, 'candidateId').map(i => i.candidateId), playersIdsUnique).length > 0) {
      throw new Match.Error('Votes must be for valid players');
    }

    if (!_.every(data, (row) => row.bet == 0 || row.bet >= this.ruleset.getMinimalBetAmount())) {
      throw new Match.Error(`Minimal bet is ${this.ruleset.getMinimalBetAmount()} coins`);
    }

    if (!_.every(data, (row) => row.stake == 0 || row.stake >= this.ruleset.getMinimalStakeAmount())) {
      throw new Match.Error(`Minimal stake is ${this.ruleset.getMinimalStakeAmount()} coins`);
    }

    if (_.filter(data, (row) => row.bet > 0).length !== 2) {
      throw new Match.Error('Only two players place bets');
    }
  }

  calculatePower() {
    const candidateIds = _.groupBy(this.data, (i) => i.candidateId);
    for (const row of this.data) {
      if (candidateIds[row.playerId]) {
        row.power = _.sumBy(candidateIds[row.playerId], (i) => i.stake);
      } else {
        row.power = 0;
      }
    }
  }

  calculateWinner() {
    const candidates = _.filter(this.data, i => i.bet);
    const candidateIds = _.map(candidates, row => row.playerId);

    const maxPower = _.maxBy(this.data, i => i.power).power;
    for (const row of this.data) {
      if (candidateIds.indexOf(row.playerId) != -1) {
        row.winner = row.power == maxPower;
      } else {
        row.winner = null;
      }
    }
  }

  calculateMajority() {
    const winners = _.map(_.filter(this.data, i => i.winner), i => i.playerId);
    for (const row of this.data) {
      if (winners.includes(row.candidateId)) {
        row.majority = true;
      } else {
        row.majority = false;
      }
    }
  }

  calculateShare() {
    for (const row of this.data) {
      row.share = _.round(
        ( row.majority ? 1 : -1 ) * row.stake / (_.sumBy(this.data, i => i.candidateId == row.candidateId && i.stake))
        , 2);
    }
  }

  calculateScalp() {
    const losersStake = _.sum(_.map(_.filter(this.data, i => i.majority === false), i => i.stake));
    for (const row of this.data) {
      row.scalp = row.majority ? _.floor(losersStake * row.share) : -row.stake;
    }
  }

  calculatePrize() {
    for (const row of this.data) {
      row.prize = ( row.winner ? 1 : -1 ) * row.bet;
    }
  }

  calculateFix() {
    for (const row of this.data) {
      row.fix = 0;
    }

    const totalWithRound = _.sumBy(this.data, i => i.scalp + i.prize + i.stash);
    const previousTotal = _.sumBy(this.data, i => i.stash);
    const diff = previousTotal - totalWithRound;

    const winner = _.find(this.data, row => row.winner);
    winner.fix = diff;
  }

  calculateTotal() {
    for (const row of this.data) {
      row.total = row.scalp + row.prize + row.fix + row.stash;
    }
  }

  isEquality() {
    return ! _.find(this.data, i => i.winner === false);
  }

  rollback() {
    for (const row of this.data) {
      row.total = row.stash;
    }
  }

  calculate() {
    this.calculatePower();
    this.calculateWinner();

    if (this.isEquality()) {
      this.rollback();
    } else {
      this.calculateMajority();
      this.calculateShare();
      this.calculateScalp();
      this.calculatePrize();
      this.calculateFix();
      this.calculateTotal();
    }

    return this.data;
  }
}
