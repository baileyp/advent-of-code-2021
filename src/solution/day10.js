const { median, sum } = require("../lib/functions");

const pairs = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
])

/**
 * Parse the puzzle input into a 2D array of lines/characters
 *
 * @param {string}  input
 * @returns {string[][]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => line.split(""));
}

/**
 * Find and return the first illegal character in a line
 *
 * @param {string}  line        The line to check
 * @returns {undefined|string}  The illegal character, or undefined if none found
 */
function findIllegal(line) {
  const expectedClosingStack = [];

  for (const char of line) {
    if (pairs.has(char)) {
      expectedClosingStack.push(pairs.get(char));
    }
    else if (char !== expectedClosingStack.pop()) {
      return char;
    }
  }

  return undefined;
}

/**
 * Given an incomplete line, return a stack of character that will complete it
 *
 * @param {string}  line  A possibly incomplete line
 * @returns {string[]}    The character needed to complete the line
 */
function autoComplete(line) {
  const expectedClosingStack = [];

  for (const char of line) {
    if (pairs.has(char)) {
      expectedClosingStack.push(pairs.get(char));
    } else {
      expectedClosingStack.pop();
    }
  }

  return expectedClosingStack.reverse();
}

module.exports = {
  /**
   * O(l * c) time and space where l is the number of lines and c is the number of characters per line
   *
   * @param {string}  input Raw puzzle input where each line is a series of chunks from the navigation subsystem
   * @returns {number}      The score for this syntax checker
   */
  part1: function(input) {
    const scoreTable = {
      ")": 3,
      "]": 57,
      "}": 1197,
      ">": 25137,
      [undefined]: 0
    };
    return parseInput(input).map(line => scoreTable[findIllegal(line)]).reduce(sum);
  },

  /**
   * O(l * c + i log i) time and space where l is the number of lines, c is the number of characters per
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
    const scores = parseInput(input)
      .filter(line => findIllegal(line) === undefined)
      .map(line => {
        return autoComplete(line)
          .map(char => scoreTable[char])
          .reduce((score, charScore) => score * 5 + charScore, 0);
      });
    return median(scores);
  }
};
