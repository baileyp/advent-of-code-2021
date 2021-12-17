const { inverseTriangleNumber, triangleNumber, range } = require("../lib/functions");

/**
 * Parse the puzzle input into a dictionary representing the target area's bounding box
 *
 * @param {string}  input
 * @returns {{yMin: number, yMax: number, xMax: number, xMin: number}}
 */
function parseInput(input) {
  const { xMin, xMax, yMin, yMax } = input
    .match(/(?<xMin>-?\d+)\.\.(?<xMax>-?\d+).+?(?<yMin>-?\d+)\.\.(?<yMax>-?\d+)/)
    .groups;
  return { xMin: parseInt(xMin), xMax: parseInt(xMax), yMin: parseInt(yMin), yMax: parseInt(yMax) };
}

module.exports = {
  /**
   * O(1) time and space - neat!
   *
   * @param {string}  input Raw input describing the bounding box of the target area
   * @returns {number}      The max height reached of the highest-arcing viable shot
   */
  part1: function(input) {
    const targetArea = parseInput(input);

    return triangleNumber(Math.abs(targetArea.yMin) - 1);
  },

  /**
   * I'm actually not sure how to calculate the time complexity here. The outer loops are no worse than O(x * y) where
   * x is largest x in the input, and y is the absolute value of the "least" y in the input. The inner while loop that
   * plots trajectories... I'm just not sure because it's related to how x and y change each loop.
   *
   * The space is O(v) where v is the number of viable initial velocities.
   *
   * @param {string}  input Raw input describing the bounding box of the target area
   * @returns {number}      The quantity of viable shots that pass through the target area
   */
  part2: function(input) {
    const targetArea = parseInput(input);

    const minViableXVelocity = inverseTriangleNumber(targetArea.xMin);
    const maxViableXVelocity = targetArea.xMax;

    const minViableYVelocity = targetArea.yMin;
    const maxViableYVelocity = Math.abs(targetArea.yMin) - 1;

    let viableInitialVelocities = new Set();

    for (const initialX of range(minViableXVelocity, maxViableXVelocity)) {
      for (const initialY of range(minViableYVelocity, maxViableYVelocity)) {
        let x = initialX;
        let y = initialY;
        let xInertia = x
        let yInertia = y;
        while (x <= targetArea.xMax && y >= targetArea.yMin) {
          if (x >= targetArea.xMin && y <= targetArea.yMax) {
            viableInitialVelocities.add([initialX, initialY].toString());
          }
          xInertia = Math.max(xInertia - 1, 0)
          yInertia -= 1
          x += xInertia;
          y += yInertia;
        }
      }
    }

    return viableInitialVelocities.size;
  }
};
