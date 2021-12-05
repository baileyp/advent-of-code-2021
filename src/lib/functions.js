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
  }
}
