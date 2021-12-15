const { cardinalNeighbors, range } = require("../lib/functions");
const { DesignError } = require("../lib/exceptions");

/**
 * Parse the puzzle input into a 2D array of risk levels
 *
 * @param {string} input
 * @returns {number[][]}
 */
function parseInput(input) {
  return input.split("\n").map(line => line.split('').map(number => parseInt(number)));
}

/**
 * Given a cave (grid), treat it as a tile and expand the tiling rightwards and downwards each by 5.
 *
 * As tiles expand away from the original, the risk levels within each tile increase by the manhattan distance away from
 * the first tile.
 *
 * @param {number[][]}  cave  The original cave
 * @returns {number[][]}      The tile-expanded cave
 */
function tileCave(cave) {
  const adjustRiskLevel = increase => riskLevel => riskLevel + increase;
  const normalize = riskLevel => riskLevel > 9 ? riskLevel - 9 : riskLevel;

  // First, tile the cave to the right
  const tiledCave = cave.map(row => {
    const newRow = [...row];
    for (const increase of range(1, 4)) {
      newRow.splice(newRow.length, 0, ...row.map(adjustRiskLevel(increase)));
    }
    return newRow.map(normalize);
  });

  // Then tile the newly-widened cave down
  for (const increase of range(1, 4)) {
    for (const rowIndex of range(0, cave.length - 1)) {
      tiledCave.push(
        tiledCave[rowIndex].map(increase(increase)).map(normalize)
      );
    }
  }

  return tiledCave;
}

/**
 * Given a cave (grid) where each location is a risk level, find the path with the lowest cumulative risk level that
 * goes from 0,0 to nX,nY and return that total risk level.
 *
 * BFS Implementation that stores the coordinate position, along with the cumulative risk level it took to get there,
 * into the queue. This ensures that when dequeueing, the program always has the optimum risk level from all prior
 * nodes up to that point.
 *
 * Basically, since the queue is sorted by risk level, ensuring that the lowest-risk locations are processed first, any
 * location that is visited will be visited at the optimum time, and blocks future re-visits from less optimal paths.
 *
 * @param {number[][]}  cave  A cave represented as 2D array of risk level numbers
 * @returns {number}          The total risk level of the lowest risk-level path
 */
function findLowestRiskPathTotal(cave) {
  const queue = [{ coordinate: [0, 0], riskLevel: 0 }];
  const visited = new Set();

  while (queue.length) {
    const { coordinate: [row, column], riskLevel } = queue.shift();

    const atEnd = row === cave.length - 1 && column === cave[0].length - 1;
    if (atEnd) {
      return riskLevel;
    }

    Array.from(cardinalNeighbors(column, row))
      // Convert return from cardinalNeighbors to [y, x] format
      .map(({ column: x, row: y }) => [y, x])
      // Eliminate coordinates out of bounds
      .filter(([y, x]) => cave[y]?.[x])
      // Eliminate coordinates already visited
      .filter(coordinate => !visited.has(coordinate.toString()))
      .forEach(coordinate => {
        const [y, x] = coordinate;
        visited.add(coordinate.toString());
        queue.push({ coordinate, riskLevel: riskLevel + cave[y][x] });
      });

    // Sort so that the next item off the queue has the lowest risk
    queue.sort((a, b) => a.riskLevel - b.riskLevel);
  }

  throw new DesignError();
}

module.exports = {
  /**
   * O(n) time and space where n is the total number of risk levels in the input
   *
   * @param {string} input  Raw puzzle input where each line is a list of risk levels 0-9
   * @returns {number}      The total risk level of the least-risky path from start to end
   */
  part1: function(input) {
    const cave = parseInput(input);
    return findLowestRiskPathTotal(cave);
  },

  /**
   * O(n) time and space where n is the total number of risk levels in the input
   *
   * Note: Because of how this puzzle is described, n actually grows and differs from the original input. You could
   * reason that the time/space complexity is O(n * t) where t represents the tile expansion value, which in the puzzle
   * description is fixed at 5.
   *
   * @param {string} input  Raw puzzle input where each line is a list of risk levels 0-9
   * @returns {number}      The total risk level of the least-risky path from start to end
   */
  part2: function(input) {
    const cave = parseInput(input);
    return findLowestRiskPathTotal(tileCave(cave));
  }
};
