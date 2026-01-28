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
    this.active = true;
  }

  hasDuplicate(value) {
    return this.numberCards.some(c => c.value === value);
  }
}

module.exports = Player;
