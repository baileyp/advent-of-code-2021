const { median } = require("../lib/functions");

const chunkOpenings = ['(', '[', '{', '<'];
const chunkClosings = [')', ']', '}', '>'];

/**
 * Parse the puzzle input into a 2D array of lines/characters
 *
 * @param {string}  input
 * @returns {(string[])[]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => line.split(""));
}

/**
 * Custom error for corrupt lines in the navigation subsystem
 */
class CorruptLineError extends Error {
  /**
   * Constructor
   * @param {string} illegalCharacter
   */
  constructor(illegalCharacter) {
    super('Corrupt Line Found');
    this.illegalCharacter = illegalCharacter;
  }
}

/**
 * Custom error for incomplete lines in the navigation subsystem
 */
class IncompleteLineError extends Error {
  /**
   * Constructor
   * @param {array} stack
   */
  constructor(stack) {
    super('Incomplete Line Found');
    this.stack = stack;
  }
}

/**
 * Determine if the given line is corrupted
 *
 * @param {string[]}  line  The line to be checked for corruption
 * @param {string[]}  stack A processed stack of closing pairs
 */
function detectCorruptLine(line, stack) {
  if (line.length === 0) {
    return;
  }
  const character = line.shift();
  if (chunkClosings.includes(character)) {
    if (character !== stack.pop()) {
      throw new CorruptLineError(character);
    }
  } else {
    stack.push(chunkClosings[chunkOpenings.indexOf(character)]);
  }
  detectCorruptLine(line, stack)
}

/**
 * Determine if the given line is incomplete
 *
 * @param {string[]}  line  The line to be checked for incompletion
 * @param {string[]}  stack A processed stack of closing pairs
 */
function detectIncompleteLine(line, stack) {
  if (line.length === 0) {
    if (stack.length !== 0) {
      throw new IncompleteLineError(stack);
    }
    return;
  }
  const character = line.shift();
  if (chunkClosings.includes(character)) {
    stack.pop();
  } else {
    stack.push(chunkClosings[chunkOpenings.indexOf(character)]);
  }
  detectIncompleteLine(line, stack)
}

module.exports = {
  /**
   * O(l * c^2) time and O(l * c) space where l is the number of lines and c is the number of characters per line
   *
   * @param {string}  input Raw puzzle input where each line is a series of chunks from the navigation subsystem
   * @returns {number}      The score for this syntax checker
   */
  part1: function(input) {
    const scoreTable = {
      ")": 3,
      "]": 57,
      "}": 1197,
      ">": 25137
    };
    let score = 0;
    parseInput(input).forEach(line => {
      try {
        detectCorruptLine(line, []);
      }
      catch (e) {
        score += scoreTable[e.illegalCharacter];
      }
    });
    return score;
  },

  /**
   * O(l * c^2 + i log i) time and O(l * c + i) space where l is the number of lines, c is the number of characters per
   * line, and i is the number of incomplete lines found.
   *
   * @param {string}  input Raw puzzle input where each line is a series of chunks from the navigation subsystem
   * @returns {number}      The score for autocomplete tool (Coder's Note: this doesn't actually complete the lines)
   */
  part2: function(input) {
    const scoreTable = {
      ")": 1,
      "]": 2,
      "}": 3,
      ">": 4
    };
    const scores = [];
    parseInput(input)
      .filter(line => {
        try {
          detectCorruptLine(Array.from(line), []);
        }
        catch (e) {
          return false;
        }
        return true;
      })
      .forEach(line => {
        try {
          detectIncompleteLine(line, []);
        }
        catch (e) {
          let lineScore = 0;
          while (e.stack.length) {
            lineScore *= 5;
            lineScore += scoreTable[e.stack.pop()];
          }
          scores.push(lineScore);
        }
      });
    return median(scores);
  }
};
