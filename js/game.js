const readline = require("readline");
const { CardType } = require("./cards");
const log = require("./logger");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise(res => rl.question(q, res));
}

function drawCard(player, deck) {
  const card = deck.pop();
  log(`${player.name} draws: ${card.toString()}`);

  if (card.type === CardType.NUMBER) {
    if (player.hasDuplicate(card.value)) {
      if (player.hasSecondChance) {
        log(`${player.name} uses SECOND CHANCE`);
        player.hasSecondChance = false;
      } else {
        log(`${player.name} ELIMINATED (duplicate ${card.value})`);
        player.active = false;
      }
      return;
    }
    player.numberCards.push(card);
  }

  if (card.type === CardType.MODIFIER) {
    player.modifiers.push(card);
  }

  if (card.type === CardType.ACTION) {
    resolveAction(card, player, deck);
  }
}

function resolveAction(card, player, deck) {
  if (!player.active) return;

  switch (card.label) {
    case "FREEZE":
      log(`${player.name} is FROZEN`);
      player.active = false;
      break;

    case "FLIP_THREE":
      log(`${player.name} must draw THREE cards`);
      for (let i = 0; i < 3 && player.active; i++) {
        drawCard(player, deck);
      }
      break;

    case "SECOND_CHANCE":
      if (!player.hasSecondChance) {
        player.hasSecondChance = true;
        log(`${player.name} gains SECOND CHANCE`);
      }
      break;
  }
}

function calculateScore(player) {
  let sum = player.numberCards.reduce((a, c) => a + c.value, 0);

  if (player.modifiers.some(m => m.label === "X2")) {
    sum *= 2;
  }

  sum += player.modifiers
    .filter(m => m.label?.startsWith("+"))
    .reduce((a, m) => a + m.value, 0);

  if (player.numberCards.length === 7) {
    sum += 15;
    log(`${player.name} FLIP 7 BONUS (+15)`);
  }

  return sum;
}

async function playRound(players, deck, round) {
  log(`\n=== ROUND ${round} ===`);
  players.forEach(p => p.resetRound());

  let active = players.filter(p => p.active);

  while (active.length > 0) {
    for (const p of active) {
      if (!p.active) continue;

      log(`\n${p.name} numbers: ${p.numberCards.map(c => c.value).join(", ") || "none"}`);
      const choice = await ask(`${p.name} draw or stay? (d/s): `);

      if (choice.toLowerCase() === "s") {
        log(`${p.name} STAYS`);
        p.active = false;
      } else {
        drawCard(p, deck);
      }

      if (p.numberCards.length === 7) return;
    }
    active = players.filter(p => p.active);
  }
}

module.exports = {
  playRound,
  calculateScore,
  rl
};
