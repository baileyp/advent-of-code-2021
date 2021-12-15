const { sum } = require('../lib/functions');
const { ComparableSet } = require('../lib/classes');

/**
 * Parse the input into an array of objects containing the patterns and output values
 *
 * @param {string} input
 * @returns {{output: ComparableSet[], patterns: ComparableSet[]}[]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => {
      const [patterns, output] = line.split(" | ").map(segment => segment.split(" "));
      return {
        patterns: patterns.map(parseDigit),
        output: output.map(parseDigit)
      };
    });
}

/**
 * Parse a single digit, such as "abc" into a ComparableSet object
 *
 * @param {string}  digit
 * @returns {ComparableSet}
 */
function parseDigit(digit) {
  return new ComparableSet(digit.split(''));
}

/**
 * Given an array of patterns representing digits 0..9, put them in order
 *
 * @param {ComparableSet[]} patterns  The ten distinct patterns as seen from a single display
 * @returns {ComparableSet[]}         Those same patterns ordered by the digit they represent, ascending
 */
function sortDigits(patterns) {
  const one = patterns.find(pattern => pattern.size === 2);
  const four = patterns.find(pattern => pattern.size === 4);
  const seven = patterns.find(pattern => pattern.size === 3);
  const eight = patterns.find(pattern => pattern.size === 7);

  const overlapsOne = pattern => pattern.isSupersetOf(one);
  const three = patterns.filter(pattern => pattern.size === 5).find(overlapsOne);

  const overlapsThree = pattern => pattern.isSupersetOf(three);
  const nine = patterns.filter(pattern => pattern.size === 6).find(overlapsThree);

  const zero = patterns.filter(pattern => pattern.size === 6)
    .find(pattern => overlapsOne(pattern) && !overlapsThree(pattern));

  const six = patterns.filter(pattern => pattern.size === 6)
    .find(pattern => !pattern.isEqualTo(nine) && !pattern.isEqualTo(zero));

  const five = patterns.filter(pattern => pattern.size === 5)
    .find(pattern => pattern.isEqualTo(pattern.intersection(six)));

  const two = patterns.filter(pattern => pattern.size === 5)
    .find(pattern => !pattern.isEqualTo(five) && !pattern.isEqualTo(three));

  return [zero, one, two, three, four, five, six, seven, eight, nine];
}

module.exports = {
  /**
   * O(d * v) time and O(1) space, where d is is the number of displays (lines of input) and v is the average number of
   * output values per display.
   *
   * @param {string}  input The raw puzzle input where each line contains 10 distinct digit patterns and several output
   *                        values. Each line is the data from a single display on the submarine.
   * @returns {number}      How many times the digits 1, 4, 7, or 8 appear in the output, totaled across all displays
   */
  part1: function(input) {
    const entries = parseInput(input);
    let displayCount = 0;
    entries.forEach(entry => {
      displayCount += entry.output.filter(value => [2, 4, 3, 7].includes(value.size)).length;
    });

    return displayCount;
  },

  /**
   * O(d * v) time and O(d + v) space, where d is is the number of displays (lines of input) and v is the average number
   * of output values per display.
   *
   * @param {string}  input The raw puzzle input where each line contains 10 distinct digit patterns and several output
   *                        values. Each line is the data from a single display on the submarine.
   * @returns {number}      The sum of all of the corrected output values for each display
   */
  part2: function(input) {
    return parseInput(input)
      .map(({ patterns, output }) => {
        const digits = sortDigits(patterns);
        const outputValue = output
          .map(outputDigit => {
            return digits.findIndex(digit => digit.isEqualTo(outputDigit)).toString();
          })
          .join('');
        return parseInt(outputValue);
      })
      .reduce(sum);
  }
};
