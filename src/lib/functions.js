module.exports = {
    /**
     * Reducer function that sums values
     *
     * @param {number}  carry   The running sum
     * @param {number}  value   The new value
     * @returns {number}        Summed total of all values
     */
    sum: (carry, value) => carry + value,
}
