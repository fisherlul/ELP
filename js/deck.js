// src/models/Deck.js
"use strict";

/**
 * Card shape used in this project.
 * - kind: "number" (MVP), later: "action" | "modifier"
 * - value: number for kind==="number"
 */
class Deck {
  /**
   * @param {Object} [opts]
   * @param {boolean} [opts.autoRefill=true] - refill draw pile from discard when empty
   */
  constructor(opts = {}) {
    this.autoRefill = opts.autoRefill !== false;

    /** @type {Array<{kind:string, value?:number, name?:string}>} */
    this.drawPile = [];
    /** @type {Array<{kind:string, value?:number, name?:string}>} */
    this.discardPile = [];

    this.buildStandardDeck();
    this.shuffle();
  }

  /**
   * Build a standard Flip7 deck (MVP: number cards only).
   * According to the rules: 12 has 12 copies, 11 has 11 copies, ..., 1 has 1 copy.
   * 0 exists too; if your teacher's version differs, adjust ZERO_COPIES.
   */
  buildStandardDeck() {
    this.drawPile = [];
    this.discardPile = [];

    const ZERO_COPIES = 1; // adjust if needed

    // Add 0
    for (let i = 0; i < ZERO_COPIES; i++) {
      this.drawPile.push({ kind: "number", value: 0 });
    }

    // Add 1..12 with copies = value
    for (let v = 1; v <= 12; v++) {
      for (let k = 0; k < v; k++) {
        this.drawPile.push({ kind: "number", value: v });
      }
    }
  }

  /**
   * Fisher–Yates shuffle in place.
   * @param {Array<any>} arr
   */
  static shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  shuffle() {
    Deck.shuffleArray(this.drawPile);
  }

  /**
   * Move all discard cards back into draw pile and shuffle.
   * NOTE: This does not touch cards currently held by players (table cards).
   */
  refillFromDiscard() {
    if (this.discardPile.length === 0) return false;
    this.drawPile.push(...this.discardPile);
    this.discardPile = [];
    this.shuffle();
    return true;
  }

  /**
   * Draw the top card.
   * @returns {{kind:string, value?:number, name?:string}}
   */
  draw() {
    if (this.drawPile.length === 0) {
      if (!this.autoRefill) {
        throw new Error("Draw pile is empty and autoRefill is disabled.");
      }
      const ok = this.refillFromDiscard();
      if (!ok) {
        throw new Error("No cards left to draw (draw pile and discard pile empty).");
      }
    }
    return this.drawPile.pop();
  }

  /**
   * Discard one card or many cards.
   * @param {{kind:string, value?:number, name?:string} | Array<{kind:string, value?:number, name?:string}>} cards
   */
  discard(cards) {
    if (!cards) return;
    if (Array.isArray(cards)) {
      for (const c of cards) this.discardPile.push(c);
    } else {
      this.discardPile.push(cards);
    }
  }

  /**
   * Utility: current counts for debugging / display.
   */
  counts() {
    return {
      draw: this.drawPile.length,
      discard: this.discardPile.length,
      total: this.drawPile.length + this.discardPile.length,
    };
  }
}

module.exports = Deck;
