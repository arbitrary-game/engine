import _ from 'lodash';

class Round {
  constructor(roundParams) {
    this.roundParams = roundParams;
  }

  calculatePower(){
    const votes = _.groupBy(this.roundParams, (i) => i.vote);
    for (const row of this.roundParams) {
      if (votes[row.player]){
        row.power = _.sumBy(votes[row.player], (i) => i.stake);
      } else {
        row.power = 0;
      }
    }
  }

  calculateWinner(){
    const votes = _.groupBy(this.roundParams, i => i.vote);

    const maxPower = _.maxBy(this.roundParams, i => i.power).power;
    for (const row of this.roundParams) {
      if (votes[row.player]){
        if (row.power == maxPower){
          row.winner = true;
        } else {
          row.winner = false;
        }

      } else {
        row.winner = null;
      }
    }
  }

  calculateMajority(){
    const winners =  _.map(_.filter(this.roundParams, i => i.winner), i => i.player)
    for (const row of this.roundParams) {
      if (winners.includes(row.vote)){
          row.majority = true;
      } else {
        row.majority = false;
      }
    }
  }

  calculateShare(){
    const winners =  _.map(_.filter(this.roundParams, i => i.winner), i => i.player)
    for (const row of this.roundParams) {
      row.share = _.ceil(
        ( row.majority ? 1 : -1 ) * row.stake / (_.sumBy(this.roundParams, i => i.vote == row.vote && i.stake))
      , 2);
    }
  }

  calculateScalp(){
    const losersStake =  _.sum(_.map(_.filter(this.roundParams, i => i.winner === false), i => i.stake));
    for (const row of this.roundParams) {
      row.scalp = losersStake * row.share;
    }
  }

  calculatePrize(){
    const losersStake =  _.sum(_.map(_.filter(this.roundParams, i => i.winner === false), i => i.stake));
    for (const row of this.roundParams) {
      row.prize = ( row.majority ? 1 : -1 ) * row.bet;
    }
  }

  calculateFix(){
    const totalWithRound =  _.sumBy(this.roundParams, i => i.scalp + i.prize + i.stash);
    const previosTotal =  _.sumBy(this.roundParams, i => i.stash);
    const diff = previosTotal - totalWithRound

    for (const row of this.roundParams) {
      if (row.winner === false){
        row.fix = diff;
      } else {
        row.fix = 0;
      }
    }
  }

  calculateTotal(){
    for (const row of this.roundParams) {
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
    return this.roundParams;
  }
}

export default Round;