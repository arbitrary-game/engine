import _ from 'lodash';

class Round {
  constructor(roundParams) {
    this.roundParams = roundParams;
  }
  calculatePower(){
    const votes = _.groupBy(this.roundParams, (i) => i.vote)
    for (const row of this.roundParams) {
      if (votes[row.player]){
        row.power = votes[row.player].length;
      } else {
        row.power = 0;
      }
    }
  }
  calculateWinner(){
    const votes = _.groupBy(this.roundParams, (i) => i.vote)
    for (const row of this.roundParams) {
      if (votes[row.player]){
        row.power = votes[row.player].length;
      } else {
        row.power = 0;
      }
    }
  }
  calculate() {
    this.calculatePower();
    this.calculateWinner();
    return this.roundParams;
  }
}

export default Round;