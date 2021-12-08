module.exports = {
  /**
   * Reducer function that sums values
   *
   * @param {number}  carry   The running sum
   * @param {number}  value   The new value
   * @returns {number}        Summed total of all values
   */
  sum: (carry, value) => carry + value,

  /**
   * Create a Generator representing an incrementing range of numbers
   *
   * @param {number}  from  Bottom of the range, inclusive
   * @param {number}  to    Top of the range, inclusive
   * @param {number}  step  Step to increment by
   * @returns {Generator<*, void, *>}
   */
  range: function*(from, to, step = 1) {
    for (let i = from; i <= to; i += step) {
      yield i;
    }
  },

  /**
   * Calculate the arithmetic median of a list of numbers
   *
   * @param {number[]}  numbers
   * @returns {number}
   */
  median: function(numbers) {
    numbers.sort((a, b) => a - b);
    const half = Math.floor(numbers.length / 2);

    return (numbers.length % 2)
      ? numbers[half]
      : (numbers[half - 1] + numbers[half]) / 2.0;
  },

  /**
   * Calculate the arithmetic mean of a list of numbers
   *
   * @param {number[]}  numbers
   * @returns {number}
   */
  mean: function(numbers) {
    return numbers.reduce(module.exports.sum) / numbers.length;
  },

  /**
   * Calculate a triangle number
   *
   * @param {number} num
   * @returns {number}
   */
  triangleNumber: function (num) {
    return (num * (num + 1)) / 2;
  }
}
