const { sum } = require('../lib/functions');

const PLAYED  = -1;

/**
 * Parse the input into an array of numbers in call order and an array of boards. 
 * 
 * Each board is a 2D array of the numbers on that board.
 * 
 * @param input
 * @returns {{boards: number[][][], numberOrder: number[]}}
 */
function parseInput(input) {
  const chunks = input.split("\n\n");
  const numberOrder = chunks.shift().split(',').map(number => parseInt(number, 10));

  const boards = chunks.map(chunk => {
    return chunk.split("\n").map(line => {
      return line.trim(' ').split(/ +/).map(number => parseInt(number, 10));
    });
  });

  return { numberOrder, boards };
}

/**
 * Call out a number to all boards.
 * 
 * @param {number}        calledNumber
 * @param {number[][][]}  boards
 */
function callNumber(calledNumber, boards) {
  boards.forEach(board => playBoard(calledNumber, board))
}

/**
 * Play a called number to a given board. If the number is found, the board is mutated and the played number
 * replaced with a negative one (-1).
 *
 * @param {number}      calledNumber
 * @param {number[][]}  board
 */
function playBoard(calledNumber, board) {
  board.forEach((row, rowNum) => {
    row.forEach((number, colNum) => {
      if (number === calledNumber) {
        board[rowNum][colNum] = PLAYED;
      }
    });
  });
}

/**
 * Determine if the given board has a winning row/column.
 *
 * @param {number[][]}  board   The gameboard to check for a win
 * @returns {boolean}           Whether or not a win was found
 */
function checkForWin(board) {
  // Check for row wins
  for (const row of board) {
    if (row.every(number => number === PLAYED)) {
      return true;
    }
  }

  // Check for column wins
  const width = board[0].length
  for (let column = 0; column < width; column++) {
    if (board.map(row => row[column]).every(number => number === PLAYED)) {
      return true;
    }
  }

  return false;
}

/**
 * Score the board by summing up all non-played (> -1) squares
 *
 * @param {number[][]}  board The board to score
 * @returns {number}          The board's score
 */
function scoreBoard(board) {
  return board.reduce((carry, row) => {
    return carry + row.filter(number => number > PLAYED).reduce(sum, 0);
  }, 0);
}

module.exports = {
  /**
   * O(n * b) time and O(n + b) space where n is the quantity of numbers and b is the total number of board squares
   *
   * @param {string}  input   Raw input where the first line is the numbers and then board definitions
   *                          separated by double spaces
   * @returns {number}        The final score of the first board to win
   */
  part1: function(input) {
    const { numberOrder, boards } = parseInput(input);

    for (const number of numberOrder) {
      callNumber(number, boards);
      for (const board of boards) {
        if (checkForWin(board)) {
          return scoreBoard(board) * number;
        }
      }
    }
  },

  /**
   * O(n * b) time and O(n + b) space where n is the quantity of numbers and b is the total number of board squares
   *
   * @param {string}  input   Raw input where the first line is the numbers and then board definitions
   *                          separated by double spaces
   * @returns {number}        The final score of the last board to win
   */
  part2: function(input) {
    const { numberOrder, boards } = parseInput(input);
    const winningBoards = new Set();
    for (const number of numberOrder) {
      callNumber(number, boards);

      for (const [boardNumber, board] of boards.entries()) {
        if (winningBoards.has(boardNumber)) {
          continue;
        }

        if (checkForWin(board)) {
          winningBoards.add(boardNumber);
        }

        if (winningBoards.size === boards.length) {
          return scoreBoard(board) * number;
        }
      }
    }
  }
};
