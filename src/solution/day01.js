const { sum } = require('../lib/functions');

module.exports = {
  /**
   * O(n) time and O(1) space
   *
   * @param {string} input  Each line is an integer measurement
   * @returns {number}      The number of increases found in the sequence
   */
  part1: function(input) {
    const measurements = input.split("\n")
      .map(parseInt);
    let previousMeasurement;
    let increases = 0;
    measurements.forEach(measurement => {
      if (previousMeasurement && measurement > previousMeasurement) {
        increases += 1;
      }
      previousMeasurement = measurement;
    });

    return increases;
  },

  /**
   * O(n) time and O(1) space
   *
   * @param {string} input  Each line is an integer measurement
   * @returns {number}      The number of increases found in the sequence based on a sliding window of 3
   */
  part2: function(input) {
    const measurements = input.split("\n")
      .map(parseInt);
    let previousMeasurement;
    let increases = 0;
    for (let windowLeft = 0, windowRight = 2; windowRight < measurements.length; windowLeft++, windowRight++) {
      const measurement = measurements.slice(windowLeft, windowRight + 1).reduce(sum);
      if (previousMeasurement && measurement > previousMeasurement) {
        increases += 1;
      }
      previousMeasurement = measurement;
    }

    return increases;
  }
};
