const { median, mean, sum, triangleNumber } = require('../lib/functions');

module.exports = {
  /**
   * O(n log n) time and O(n) space
   *
   * Note: the time complexity is an assumption based on the usage of Array.prototype.sort()
   *
   * @param {string}  input Comma-separated list of numbers representing crab submarine positions
   * @returns {number}      The total fuel consumption after all crab submarines align
   */
  part1: function(input) {
    const crabPositions = input.split(',').map(number => parseInt(number, 10));
    const idealPosition = median(crabPositions);

    return crabPositions.map(crabPosition => Math.abs(crabPosition - idealPosition)).reduce(sum);
  },

  /**
   * O(n) time and space
   *
   * @param {string}  input Comma-separated list of numbers representing crab submarine positions
   * @returns {number}      The total fuel consumption after all crab submarines align
   */
  part2: function(input) {
    const crabPositions = input.split(',').map(number => parseInt(number, 10));
    const idealPositionGuess1 = Math.floor(mean(crabPositions));
    const idealPositionGuess2 = Math.ceil(mean(crabPositions));

    return Math.min(
      crabPositions.map(crabPosition => triangleNumber(Math.abs(crabPosition - idealPositionGuess1))).reduce(sum),
      crabPositions.map(crabPosition => triangleNumber(Math.abs(crabPosition - idealPositionGuess2))).reduce(sum)
    );
  }
};
