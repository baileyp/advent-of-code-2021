/**
 * An axis object
 * @typedef {{from: number, to: number}} Axis
*/
/**
 * A cuboid object
 * @typedef {{x: Axis, y: Axis, z: Axis}} Cuboid
 */
/**
 * A reboot step object
 * @typedef {{polarity: string, cuboid: Cuboid}} RebootStep
 */
const { range } = require("../lib/functions");

/**
 * Parse the puzzle input into a series of reboot steps
 *
 * @param {string}  input
 * @returns {RebootStep[]}
 */
function parseInput(input) {
  return input.split('\n').map(line => {
    const [polarity, rawCuboid] = line.split(' ');

    const cuboid = rawCuboid.split(',').reduce((cuboid, side) => {
      const [axis, axisRange] = side.split('=');
      const [from, to] = axisRange.split('..').map(Number);
      cuboid[axis] = { from, to };
      return cuboid;
    }, {});

    return { polarity, cuboid };
  });
}

/**
 * Given an axis, return all the points along its line
 *
 * @param {Axis} axis
 * @returns {Generator<number>}
 */
function points(axis) {
  return range(axis.from, axis.to);
}

/**
 * Filter out only initialization steps
 *
 * @param {RebootStep} step The step to check
 * @returns {boolean}       Whether or not this is an initialization step
 */
function initialization(step) {
  const { cuboid: { x, y, z } } = step;
  const from = [x.from, y.from, z.from];
  const to = [x.to, y.to, z.to];
  const inBounds = point => point >= -50 && point <= 50;

  return from.every(inBounds) && to.every(inBounds);
}

/**
 * Determine if the two cuboids intersect each other
 *
 * @param {Cuboid} cuboid1
 * @param {Cuboid} cuboid2
 * @returns {boolean}
 */
function cuboidsIntersect(cuboid1, cuboid2) {
  return Math.max(cuboid1.x.from, cuboid2.x.from) <= Math.min(cuboid1.x.to, cuboid2.x.to)
    && Math.max(cuboid1.y.from, cuboid2.y.from) <= Math.min(cuboid1.y.to, cuboid2.y.to)
    && Math.max(cuboid1.z.from, cuboid2.z.from) <= Math.min(cuboid1.z.to, cuboid2.z.to);
}

/**
 * Calculate the volume of a cuboid
 *
 * @param {Cuboid} cuboid
 * @returns {number}
 */
function volume(cuboid) {
  return (1 + cuboid.x.to - cuboid.x.from) * (1 + cuboid.y.to - cuboid.y.from) * (1 + cuboid.z.to - cuboid.z.from);
}

/**
 * Create a clone of a cuboid
 *
 * @param {Cuboid}  cuboid
 * @returns {Cuboid}
 */
function clone(cuboid) {
  return { x: { ...cuboid.x }, y: { ...cuboid.y }, z: { ...cuboid.z } }
}

/**
 * Slice a cuboid into 1-6 new cuboids based on the boundaries of another cuboid
 *
 * @param {Cuboid}  cuboid      The cuboid to slice up
 * @param {Cuboid}  baseCuboid  The cuboid to slide around
 * @returns {Generator<Cuboid, void>}
 */
function* sliceCuboid(cuboid, baseCuboid) {
  for (const axis of ['x', 'y', 'z']) {
    if (cuboid[axis].from < baseCuboid[axis].from) {
      const slice = clone(cuboid);
      slice[axis].to = baseCuboid[axis].from - 1;
      cuboid[axis].from = baseCuboid[axis].from;
      if (slice[axis].from <= slice[axis].to) {
        yield slice;
      }
    }

    if (cuboid[axis].to > baseCuboid[axis].to) {
      const slice = clone(cuboid);
      slice[axis].from = baseCuboid[axis].to + 1;
      cuboid[axis].to = baseCuboid[axis].to;
      if (slice[axis].from <= slice[axis].to) {
        yield slice;
      }
    }
  }
}

module.exports = {
  /**
   * O(x * y * z) time and O(x + y + z) space where x, y, and z represent the coordinates of individual cubes from the
   * puzzle input
   *
   * @param {string}  input Raw puzzle input describing the core's reboot steps
   * @returns {number}      The number of core cubes switched on after the initialization steps
   */
  part1: function(input) {
    const rebootSteps = parseInput(input);
    const core = new Set();

    rebootSteps
      .filter(initialization)
      .forEach(({ polarity, cuboid }) => {
        const action = polarity === 'on' ? core.add.bind(core) : core.delete.bind(core);

        for (const x of points(cuboid.x)) {
          for (const y of points(cuboid.y)) {
            for (const z of points(cuboid.z)) {
              action([x, y, z].toString());
            }
          }
        }
      });

    return core.size;
  },

  /**
   * O(n * c) time and O(c) space where n is the number of reboot steps and c is the total number of discrete cuboids
   * generated to define the core
   *
   * @param {string}  input Raw puzzle input describing the core's reboot steps
   * @returns {number}      The number of core cubes switched on after a full reboot
   */
  part2: function(input) {
    const rebootSteps = parseInput(input);

    const cuboids = rebootSteps.reduce((cuboids, { polarity, cuboid: newCuboid }) => {
      const cuboidsAtStep = [];

      if (polarity === 'on') {
        cuboidsAtStep.push(newCuboid);
      }

      cuboids.forEach(cuboid => {
        if (cuboidsIntersect(newCuboid, cuboid)) {
          for (const slice of sliceCuboid(cuboid, newCuboid)) {
            cuboidsAtStep.push(slice);
          }
        } else {
          cuboidsAtStep.push(cuboid);
        }
      });

      return cuboidsAtStep;
    }, []);

    return cuboids.reduce((onCubes, cuboid) => {
      return onCubes + volume(cuboid);
    }, 0);
  }
};
