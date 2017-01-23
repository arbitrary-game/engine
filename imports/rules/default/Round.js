import {Match, check} from 'meteor/check';
import _ from 'lodash';

class Round {
  constructor(params) {
    // types check
    check(params, [Object]);
    check(params, [
      {
        player: String,
        stash: Number,
        bet: Number,
        stake: Number,
        vote: String,
      }
    ]);
    // logic

    if (params.length < 2) {
      throw new Match.Error('There should be more that one player');
    }

    if (!_.every(params, (row) => (row.bet + row.stake) <= row.stash)) {
      throw new Match.Error('Bet + Stake <= Stash');
    }

    const playersIds = params.map(i => i.player);
    const playersIdsUnique = _.uniqBy(params, 'player').map(i => i.player);
    if ((_.difference(playersIds, playersIdsUnique).length > 0) || playersIds.length != playersIdsUnique.length) {
      throw new Match.Error('Players ids should be unique');
    }

    if (_.difference(_.uniqBy(params, 'vote').map(i => i.vote), playersIdsUnique).length > 0) {
      throw new Match.Error('Votes must be for valid players');
    }

    if (!_.every(params, (row) => row.bet == 0 || row.bet >= 10)) {
      throw new Match.Error('Minimal bet is 10 coins');
    }

    if (!_.every(params, (row) => row.stake == 0 || row.stake >= 10)) {
      throw new Match.Error('Minimal stake is 10 coins');
    }

    if (_.filter(params, (row) => row.bet > 0).length !== 2) {
      throw new Match.Error('Only two players place bets');
    }

    this.params = params;
  }

  calculatePower() {
    const votes = _.groupBy(this.params, (i) => i.vote);
    for (const row of this.params) {
      if (votes[row.player]) {
        row.power = _.sumBy(votes[row.player], (i) => i.stake);
      } else {
        row.power = 0;
      }
    }
  }

  calculateWinner() {
    const votes = _.groupBy(this.params, i => i.vote);

    const maxPower = _.maxBy(this.params, i => i.power).power;
    for (const row of this.params) {
      if (votes[row.player]) {
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
    const winners = _.map(_.filter(this.params, i => i.winner), i => i.player)
    for (const row of this.params) {
      if (winners.includes(row.vote)) {
        row.majority = true;
      } else {
        row.majority = false;
      }
    }
  }

  calculateShare() {
    const winners = _.map(_.filter(this.params, i => i.winner), i => i.player)
    for (const row of this.params) {
      row.share = _.ceil(
        ( row.majority ? 1 : -1 ) * row.stake / (_.sumBy(this.params, i => i.vote == row.vote && i.stake))
        , 2);
    }
  }

  calculateScalp() {
    const losersStake = _.sum(_.map(_.filter(this.params, i => i.winner === false), i => i.stake));
    for (const row of this.params) {
      row.scalp = losersStake * row.share;
    }
  }

  calculatePrize() {
    const losersStake = _.sum(_.map(_.filter(this.params, i => i.winner === false), i => i.stake));
    for (const row of this.params) {
      row.prize = ( row.majority ? 1 : -1 ) * row.bet;
    }
  }

  calculateFix() {
    const totalWithRound = _.sumBy(this.params, i => i.scalp + i.prize + i.stash);
    const previosTotal = _.sumBy(this.params, i => i.stash);
    const diff = previosTotal - totalWithRound

    for (const row of this.params) {
      if (row.winner === false) {
        row.fix = diff;
      } else {
        row.fix = 0;
      }
    }
  }

  calculateTotal() {
    for (const row of this.params) {
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
    return this.params;
  }
}

export default Round;
