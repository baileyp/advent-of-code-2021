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
   * Reducer function that multiplies values
   *
   * @param {number}  carry   The running product
   * @param {number}  value   The new value
   * @returns {number}        Multiplied total of all values
   */
  product: (carry, value) => carry * value,

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
  },

  /**
   * Inverse of finding the nth triangle number. Given n, determine the triangle's size
   *
   * @param {number}  num
   * @returns {number}
   */
  inverseTriangleNumber: function(num) {
    return Math.floor(Math.sqrt(num * 2));
  },

  /**
   * Find the cartesian neighbors of a given coordinate point
   *
   * @param {number}  column        Or 'x' in traditional grid systems
   * @param {number}  row           Or 'y' in traditional grid systems
   * @param {boolean} includeOrigin Whether or not the yielded values should include the input coordinate
   *
   * @returns {Generator<{column: number, row: number}, void>}
   */
  neighbors: function*(column, row, includeOrigin = false) {
    for (let rowOffset = row - 1; rowOffset <= row + 1; rowOffset++) {
      for (let colOffset = column - 1; colOffset <= column + 1; colOffset++) {
        if (!includeOrigin && colOffset === column && rowOffset === row) {
          continue;
        }
        yield { column: colOffset, row: rowOffset };
      }
    }
  },

  /**
   * Find just the cardinal cartesian neighbors of a given coordinate point
   *
   * @param {number}  column  Or 'x' in traditional grid systems
   * @param {number}  row     Or 'y' in traditional grid systems
   * @returns {Generator<{column: number, row}, void, *>}
   */
  cardinalNeighbors: function* (column, row) {
    yield { column: column - 1, row };
    yield { column: column + 1, row };
    yield { column, row: row - 1 };
    yield { column, row: row + 1 };
  },

  /**
   * Execute any function repeatedly
   *
   * @param {function}  callback    The function to call
   * @param {number}    iterations  The number of times to call the function
   */
  repeatFunction: function(callback, iterations) {
    for (const _ of module.exports.range(1, iterations)) {
      callback();
    }
  }
}
