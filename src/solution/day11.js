const { repeatFunction, neighbors } = require("../lib/functions");

const MAX_ENERGY_LEVEL = 9;
const FLASH_RESET_LEVEL = 0;

/**
 * Parse the puzzle into into a 2D array of numbers.
 *
 * @param {string} input
 * @returns {number[][]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => line.split('').map(number => parseInt(number)));
}

/**
 * Step the grid through a single energy-increase lifecycle.
 *
 * Mutates the values in the grid.
 *
 * @param {number[][]}  grid  A grid of octopuses positions and their energy levels
 */
function step(grid) {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      grid[row][column] += 1;
    }
  }
}

/**
 * Convert an octopus object into a sting representation of it's coordinate position.
 *
 * @param {number}  row     Octopus' row position
 * @param {number}  column  Octopus' column position
 * @returns {string}        Coordinate position in the format of "x,y"
 */
function octopusToCoordinate({ row, column }) {
  return `${row},${column}`;
}

/**
 * Convert a coordinate position back into an octopus object.
 *
 * @param {string}  coordinate              Coordinate position in the format of "x,y"
 * @returns {{column: number, row: number}} Octopus' row/column position
 */
function octopusFromCoordinate(coordinate) {
  const [row, column] = coordinate.split(',').map(number => parseInt(number));
  return { row, column };
}

/**
 * Find all flashing octopuses in the grid, propagate their flash to neighboring octopuses, and return the number of
 * octopuses that flashed this cycle.
 *
 * @param {number[][]}  grid  A grid of octopuses positions and their energy levels
 * @returns {number}          The number of octopuses that flashed
 */
function processAndCountFlashes(grid) {
  const toFlash = new Set();

  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column] > MAX_ENERGY_LEVEL) {
        toFlash.add(octopusToCoordinate({ row, column }));
      }
    }
  }

  toFlash.forEach(coordinate => {
    const octopus = octopusFromCoordinate(coordinate);
    Array.from(neighbors(octopus.column, octopus.row))
      .filter(({ row, column }) => row in grid && column in grid[row])
      .forEach(({ row, column }) => {
        grid[row][column] += 1;
        if (grid[row][column] > MAX_ENERGY_LEVEL) {
          toFlash.add(octopusToCoordinate({ row, column }));
        }
      });
  });

  toFlash.forEach(coordinate => {
    const { row, column } = octopusFromCoordinate(coordinate);
    grid[row][column] = FLASH_RESET_LEVEL;
  });

  return toFlash.size;
}

module.exports = {
  /**
   * O(n) time and space where n is the total number of octopuses
   *
   * @param {string}  input Raw puzzle input that's a grid of octopus energy levels
   * @returns {number}      The total number of octopuses flashes after 100 steps
   */
  part1: function(input) {
    const grid = parseInput(input);
    let totalFlashes = 0;
    repeatFunction(() => {
      step(grid);
      totalFlashes += processAndCountFlashes(grid);
    }, 100);
    return totalFlashes;
  },

  /**
   * O(n) time and space where n is the total number of octopuses
   *
   * @param {string}  input Raw puzzle input that's a grid of octopus energy levels
   * @returns {number}      The step number at which all octopuses flash at once
   */
  part2: function(input) {
    const grid = parseInput(input);
    const totalOctopuses = grid.length * grid[0].length;
    let stepNumber = 1;
    while (true) {
      step(grid);
      if (processAndCountFlashes(grid) === totalOctopuses) {
        return stepNumber;
      }
      stepNumber += 1;
    }
  }
};
