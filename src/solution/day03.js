const { range } = require("../lib/functions");

/**
 * Given a list of binary numbers as strings, determine the "polarity" of each bit position.
 *
 * Polarity is determined "counting cards" style, where a negative value indicates that 0 was the most common
 * bit, a positive value indicates that 1 was the most common bit, and 0 indicates they were equally common.
 *
 * @param {string[]}  binaryList  An array of binary numbers as strings
 * @returns {number[]}            An array of polarities where the first bit is in the nth position
 */
function binaryListToPolarityArray(binaryList) {
  const numbers = binaryList.map(bin => parseInt(bin, 2));

  const bitWidth = binaryList[0].length;
  const counts = new Array(bitWidth).fill(0);

  numbers.forEach(entry => {
    for (let width of range(0, bitWidth - 1)) {
      const mask = 2 ** width;
      const bitIsSet = (entry & mask) === mask;
      counts[width] += bitIsSet ? 1 : -1;
    }
  });

  return counts.reverse();
}

module.exports = {
  /**
   * O(n * w) time and O(w) space where n is the quantity of numbers in the report and w is the width of the
   * binary numbers in the report
   *
   * @param {string} input
   * @returns {number}
   */
  part1: function(input) {
    const diagnosticReport = input.split("\n");
    const counts = binaryListToPolarityArray(diagnosticReport);

    const gammaRateBinary = counts.map(polarity => polarity > 0 ? '1' : '0').join('');
    const epsilonRateBinary = counts.map(polarity => polarity < 0 ? '1' : '0').join('');
    const gammaRate = parseInt(gammaRateBinary, 2);
    const epsilonRate = parseInt(epsilonRateBinary, 2);

    return gammaRate * epsilonRate;
  },

  part2: function(input) {
    const diagnosticReport = input.split("\n");
  }
};
