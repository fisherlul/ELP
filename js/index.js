const Player = require("./player");
const { createDeck } = require("./deck");
const { playRound, calculateScore, rl } = require("./game");
const log = require("./logger");

async function main() {
  log("Starting Flip 7");

  const ask = q => new Promise(res => rl.question(q, res));
  const count = parseInt(await ask("Number of players: "));
  const players = [];

  for (let i = 0; i < count; i++) {
    const name = await ask(`Player ${i + 1} name: `);
    players.push(new Player(name));
  }

  let deck = createDeck();
  let round = 1;

  while (!players.some(p => p.totalScore >= 200)) {
    if (deck.length < 20) {
      log("RESHUFFLING DECK");
      deck = createDeck();
    }

    await playRound(players, deck, round);

    for (const p of players) {
      if (p.numberCards.length > 0) {
        const score = calculateScore(p);
        p.totalScore += score;
        log(`${p.name} scores ${score} → TOTAL ${p.totalScore}`);
      }
    }
    round++;
  }

  players.sort((a, b) => b.totalScore - a.totalScore);
  log(`\n🏆 WINNER: ${players[0].name} (${players[0].totalScore} pts)`);

  rl.close();
}

main();
