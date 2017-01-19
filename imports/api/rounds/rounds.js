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
    console.log('winners', winners);
    for (const row of this.roundParams) {
      if (winners.includes(row.vote)){
          row.majority = true;
      } else {
        row.majority = false;
      }
    }
  }

  calculate() {
    this.calculatePower();
    this.calculateWinner();
    this.calculateMajority();
    return this.roundParams;
  }
}

export default Round;