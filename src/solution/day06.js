const { range, sum } = require('../lib/functions');
const { DefaultMap } = require('../lib/classes');

const NEW_FISH_AGE = 8;
const SPAWN_FISH_AGE = 6;

module.exports = {
  /**
   * O(n) time and O(1) space with respect to the puzzle input, where n is the initial quantity of fish.
   *
   * O(n + d) time and and O(1) space where d is the number of days to pass, if considering that as part of the input.
   *
   * @param {string}  input Comma-separate list of number representing fish ages
   * @returns {number}      Total number of fish after n days
   */
  part1: function(input, numDays = 80) {
    const fish = input.split(',').map(number => parseInt(number));

    const fishPerAge = new DefaultMap(() => 0);
    fish.forEach(age => {
      fishPerAge.set(age, fishPerAge.get(age) + 1);
    });

    for (const day of range(1, numDays)) {
      const spawningFish = fishPerAge.get(0);
      for (const age of range(1, NEW_FISH_AGE)) {
        fishPerAge.set(age - 1, fishPerAge.get(age));
      }
      fishPerAge.set(SPAWN_FISH_AGE, fishPerAge.get(SPAWN_FISH_AGE) + spawningFish);
      fishPerAge.set(NEW_FISH_AGE, spawningFish);
    }

    return Array.from(fishPerAge.values()).reduce(sum);
  },

  part2: function(input) {
    return module.exports.part1(input, 256);
  }
};
