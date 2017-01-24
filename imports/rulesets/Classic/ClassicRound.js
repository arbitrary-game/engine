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
        votedForPlayerId: String,
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

    if (_.difference(_.uniqBy(data, 'votedForPlayerId').map(i => i.votedForPlayerId), playersIdsUnique).length > 0) {
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
    const votedForPlayerIds = _.groupBy(this.data, (i) => i.votedForPlayerId);
    for (const row of this.data) {
      if (votedForPlayerIds[row.playerId]) {
        row.power = _.sumBy(votedForPlayerIds[row.playerId], (i) => i.stake);
      } else {
        row.power = 0;
      }
    }
  }

  calculateWinner() {
    const votedForPlayerIds = _.groupBy(this.data, i => i.votedForPlayerId);

    const maxPower = _.maxBy(this.data, i => i.power).power;
    for (const row of this.data) {
      if (votedForPlayerIds[row.playerId]) {
        if (row.power == maxPower) {
          row.winner = true;
        } else {
          row.winner = false;
        }

      } else {
        row.winner = null;
      }
    }
  }

  calculateMajority() {
    const winners = _.map(_.filter(this.data, i => i.winner), i => i.playerId);
    for (const row of this.data) {
      if (winners.includes(row.votedForPlayerId)) {
        row.majority = true;
      } else {
        row.majority = false;
      }
    }
  }

  calculateShare() {
    const winners = _.map(_.filter(this.data, i => i.winner), i => i.playerId);
    for (const row of this.data) {
      row.share = _.ceil(
        ( row.majority ? 1 : -1 ) * row.stake / (_.sumBy(this.data, i => i.votedForPlayerId == row.votedForPlayerId && i.stake))
        , 2);
    }
  }

  calculateScalp() {
    const losersStake = _.sum(_.map(_.filter(this.data, i => i.winner === false), i => i.stake));
    for (const row of this.data) {
      row.scalp = losersStake * row.share;
    }
  }

  calculatePrize() {
    const losersStake = _.sum(_.map(_.filter(this.data, i => i.winner === false), i => i.stake));
    for (const row of this.data) {
      row.prize = ( row.majority ? 1 : -1 ) * row.bet;
    }
  }

  calculateFix() {
    const totalWithRound = _.sumBy(this.data, i => i.scalp + i.prize + i.stash);
    const previosTotal = _.sumBy(this.data, i => i.stash);
    const diff = previosTotal - totalWithRound

    for (const row of this.data) {
      if (row.winner === false) {
        row.fix = diff;
      } else {
        row.fix = 0;
      }
    }
  }

  calculateTotal() {
    for (const row of this.data) {
      row.total = row.scalp + row.prize + row.fix + row.stash;
    }
  }

  calculate() {
    this.calculatePower();
    this.calculateWinner();
    this.calculateMajority();
    this.calculateShare();
    this.calculateScalp();
    this.calculatePrize();
    this.calculateFix();
    this.calculateTotal();
    return this.data;
  }
}
