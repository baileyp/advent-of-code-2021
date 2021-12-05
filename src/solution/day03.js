const { range } = require("../lib/functions");

module.exports = {
  /**
   * O(n * w) time and O(w) space where n is the quantity of numbers in the report and w is the width of the
   * binary numbers in the report
   *
   * @param {string} input
   * @returns {number}
   */
  part1: function(input) {
    const diagnosticReport = input.split("\n")
      .map(bin => parseInt(bin, 2));

    const bitWidth = input.split("\n").pop().length;
    const epsilonMask = 2 ** bitWidth - 1;
    const counts = new Array(bitWidth).fill(0);

    diagnosticReport.forEach(entry => {
      for (let width of range(0, bitWidth - 1)) {
        const mask = 2 ** width;
        const bitIsSet = (entry & mask) === mask;
        counts[width] += bitIsSet ? 1 : -1;
      }
    });

    const gammaRateBinary = counts.reverse().map(polarity => polarity > 0 ? '1' : '0').join('');
    const gammaRate = parseInt(gammaRateBinary, 2)
    const epsilonRate = gammaRate ^ epsilonMask;

    return gammaRate * epsilonRate;
  },
};
