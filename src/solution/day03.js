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

/**
 * Iteratively apply the Oxygen Generator Rating criteria to a list of binary numbers to calculate the rating
 *
 * @param {string[]}  binaryList  An array of binary numbers as strings
 * @returns {number}              The final rating value
 */
function determineOxygenGeneratorRating(binaryList) {
  let bitPosition = 1;
  let filteredReport = applyOxygenGeneratorBitCriteria(binaryList, 0);
  while (filteredReport.length > 1) {
    filteredReport = applyOxygenGeneratorBitCriteria(filteredReport, bitPosition);
    bitPosition += 1;
  }

  return parseInt(filteredReport.pop(), 2);
}

/**
 * Iteratively apply the CO2 Scrubber Rating criteria to a list of binary numbers to calculate the rating
 *
 * @param {string[]}  binaryList  An array of binary numbers as strings
 * @returns {number}              The final rating value
 */
function determineCO2ScrubberRating(binaryList) {
  let bitPosition = 1;
  let filteredReport = applyCO2ScrubberBitCriteria(binaryList, 0);
  while (filteredReport.length > 1) {
    filteredReport = applyCO2ScrubberBitCriteria(filteredReport, bitPosition);
    bitPosition += 1;
  }
  return parseInt(filteredReport.pop(), 2);
}

/**
 * Given a list of binary numbers, apply the Oxygen Generator Rating criteria
 *
 * @param {string[]}  binaryList  An array of binary numbers as strings
 * @param {number}    bitOffset   An offset used to inspect the binary numbers where zero is the nth bit
 * @returns {string[]}
 */
function applyOxygenGeneratorBitCriteria(binaryList, bitOffset = 0) {
  const counts = binaryListToPolarityArray(binaryList);

  return binaryList.filter(binaryNumber => {
    const countAtPosition = counts[bitOffset];
    const mostCommonBit = countAtPosition < 0 ? '0' : '1'
    return binaryNumber[bitOffset] === mostCommonBit;
  });
}

/**
 * Given a list of binary numbers, apply the CO2 Scrubber Rating criteria
 *
 * @param {string[]}  binaryList  An array of binary numbers as strings
 * @param {number}    bitOffset   An offset used to inspect the binary numbers where zero is the nth bit
 * @returns {string[]}
 */
function applyCO2ScrubberBitCriteria(binaryList, bitOffset = 0) {
  const counts = binaryListToPolarityArray(binaryList);

  return binaryList.filter(binaryNumber => {
    const countAtPosition = counts[bitOffset];
    const leastCommonBit = countAtPosition < 0 ? '1' : '0'
    return binaryNumber[bitOffset] === leastCommonBit;
  });
}

module.exports = {
  /**
   * O(n * w) time and O(n + w) space where n is the quantity of numbers in the report and w is the width of the
   * binary numbers in the report
   *
   * @param {string} input  Each line is a binary number
   * @returns {number}      The power consumption of the submarine
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

  /**
   * O(n * w) time and O(n + w) space where n is the quantity of numbers in the report and w is the width of the
   * binary numbers in the report
   *
   * @param {string} input  Each line is a binary number
   * @returns {number}      The life support rating of the submarine
   */
  part2: function(input) {
    const diagnosticReport = input.split("\n");

    const oxygenGeneratorRating = determineOxygenGeneratorRating(diagnosticReport);
    const co2ScrubberRating = determineCO2ScrubberRating(diagnosticReport);

    return oxygenGeneratorRating * co2ScrubberRating;
  }
};
