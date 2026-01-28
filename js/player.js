class Player {
  constructor(name) {
    this.name = name;
    this.totalScore = 0;
    this.resetRound();
  }

  resetRound() {
    this.numberCards = [];
    this.modifiers = [];
    this.hasSecondChance = false;
    this.active = true;  // ready to resolve actions
    this.busted = false;  // eliminated from round (by doublon or freeze)
    
  }

  hasDuplicate(value) {
    return this.numberCards.some(c => c.value === value);
  }
}

module.exports = Player;
