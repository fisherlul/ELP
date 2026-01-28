const CardType = {
  NUMBER: "number",
  ACTION: "action",
  MODIFIER: "modifier"
};

class Card {
  constructor(type, value, label = null) {
    this.type = type;
    this.value = value;
    this.label = label;
  }

  toString() {
    if (this.type === CardType.NUMBER) return `Number ${this.value}`;
    return this.label;
  }
}

module.exports = { Card, CardType };
