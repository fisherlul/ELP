const { Card, CardType } = require("cards");

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createDeck() {
  const deck = [];

  // Number cards
  for (let n = 12; n >= 1; n--) {
    for (let i = 0; i < n; i++) {
      deck.push(new Card(CardType.NUMBER, n));
    }
  }
  deck.push(new Card(CardType.NUMBER, 0));

  // Action cards
  for (let i = 0; i < 5; i++) {
    deck.push(new Card(CardType.ACTION, null, "FREEZE"));
    deck.push(new Card(CardType.ACTION, null, "FLIP_THREE"));
    deck.push(new Card(CardType.ACTION, null, "SECOND_CHANCE"));
  }

  // Modifier cards
  for (let i = 2; i <= 10; i++) {
    deck.push(new Card(CardType.MODIFIER, i, `+${i}`));
  }
  deck.push(new Card(CardType.MODIFIER, 2, "X2"));

  shuffle(deck);
  return deck;
}

module.exports = { createDeck };