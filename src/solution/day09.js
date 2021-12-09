const { cardinalNeighbors, neighbors, product, sum } = require("../lib/functions");

/**
 * Parse the puzzle into into a 2D array of numbers
 *
 * @param {string} input
 * @returns {number[][]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => line.split('').map(number => parseInt(number)));
}

/**
 * Given a height map, find all of the low points as row/column/height objects
 *
 * @param {number[][]}  heightmap A 2D array of height values
 * @returns {{row: number, column: number, height: number}[]}
 */
function findLowPoints(heightmap) {
  const lowPoints = [];

  heightmap.forEach((row, rowIndex) => {
    row.forEach((height, colIndex) => {
      const isLowPoint = Array.from(neighbors(colIndex, rowIndex))
        .filter(({ row, column }) => row in heightmap && column in heightmap[row])
        .every(({ row, column }) => heightmap[row][column] > height);
      if (isLowPoint) {
        lowPoints.push({ row: rowIndex, column: colIndex, height: heightmap[rowIndex][colIndex] });
      }
    });
  });

  return lowPoints;
}

module.exports = {
  /**
   * O(h + l) time and space where h is the total number of heights in the map and l is the number of low points
   *
   * @param {string}  input Raw puzzle input that's a grid of height values
   * @returns {number}      The sum of all the risk levels in the heightmap's low points
   */
  part1: function(input) {
    return findLowPoints(parseInput(input))
      .map(lowPoint => lowPoint.height + 1)
      .reduce(sum);
  },

  /**
   * O(h + b log b) time and O(h + b) space where h is the total number of heights in the map and b is the number of
   * basins.
   *
   * Note: the time complexity is an assumption based on the usage of Array.prototype.sort()
   *
   * @param {string}  input Raw puzzle input that's a grid of height values
   * @returns {number}      The sum of all the risk levels in the heightmap's low points
   */
  part2: function(input) {
    const heightmap = parseInput(input);
    const lowPoints = findLowPoints(heightmap);

    const basins = lowPoints.map(lowPoint => {
      const visited = new Set();
      function dfsVisit(columnIndex, rowIndex) {
        const point = `${columnIndex},${rowIndex}`;
        if (visited.has(point)) {
          return;
        }
        if (heightmap[rowIndex][columnIndex] === 9) {
          return;
        }

        visited.add(point);
        Array.from(cardinalNeighbors(columnIndex, rowIndex))
          .filter(({ row, column }) => row in heightmap && column in heightmap[row])
          .forEach(({ row, column }) => dfsVisit(column, row));
      }

      dfsVisit(lowPoint.column, lowPoint.row);

      return visited;
    });

    return basins.map(basin => basin.size)
      .sort((a, b) => a - b)
      .slice(-3)
      .reduce(product, 1);
  }
};
