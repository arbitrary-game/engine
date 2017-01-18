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
    // const votes = _.groupBy(this.roundParams, (i) => i.vote);
    // const winner = _.maxBy(votes, 'length');
    // for (const row of this.roundParams) {
    //   if (winner[row.player]){
    //     row.winner = true;
    //   } else {
    //     if (votes[row.player]){
    //       row.winner = false;
    //     } else {
    //       row.winner = null;
    //     }
    //   }
    // }
  }
  calculate() {
    this.calculatePower();
    this.calculateWinner();
    return this.roundParams;
  }
}

export default Round;