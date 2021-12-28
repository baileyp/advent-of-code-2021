/**
 * A Region type
 * @typedef {{east: Set<string>, south: Set<string>, [changed]: boolean }} Region
 */

const SOUTH = 'v';
const EAST = '>';

/**
 * Parse the puzzle input into a region of east/south sets and dimensions
 *
 * @param {string}  input
 * @returns {{region: Region, width: number, height: number}}
 */
function parseInput(input) {
  const east = new Set();
  const south = new Set();
  let width = 0;
  let height = 0;

  input.split('\n').forEach((line, row) => {
    height += 1;
    width = line.length;
    line.split('').forEach((item, column) => {
      const coordinate = [row, column].toString();
      if (item === EAST) {
        east.add(coordinate);
      } else if (item === SOUTH) {
        south.add(coordinate);
      }
    });
  });

  return { region: { east, south }, width, height };
}

/**
 * Move all the sea cucumbers in a region for a single step
 *
 * @param {Region}  region  The region defining east/south cucumbers
 * @param {number}  width   Width of the region
 * @param {number}  height  Height of the region
 * @returns {Region}
 */
function move(region, width, height) {
  const { east, changed: eastChanged } = moveEast(region, width);
  const { south, changed: southChanged } = moveSouth({ ...region, east }, height);

  return { east, south, changed: eastChanged || southChanged };
}

/**
 * Get the new east positions of sea cucumbers
 *
 * @param {Region}  region
 * @param {number}  width
 * @returns {{east: Set<string>, changed: boolean}}
 */
function moveEast(region, width) {
  const east = new Set();
  let changed = false;

  for (const coordinate of region.east) {
    const [row, column] = coordinate.split(',').map(Number);
    const nextColumn = column + 1 === width ? 0 : column + 1;
    const nextCoordinate = [row, nextColumn].toString();
    const nextCoordinateBlocked = region.east.has(nextCoordinate) || region.south.has(nextCoordinate);

    east.add(nextCoordinateBlocked ? coordinate : nextCoordinate);
    changed = changed || !nextCoordinateBlocked;
  }

  return { east, changed };
}

/**
 * Get the new south positions of sea cucumbers
 *
 * @param {Region}  region
 * @param {number}  height
 * @returns {{south: Set<string>, changed: boolean}}
 */
function moveSouth(region, height) {
  const south = new Set();
  let changed = false;

  for (const coordinate of region.south) {
    const [row, column] = coordinate.split(',').map(Number);
    const nextRow = row + 1 === height ? 0 : row + 1;
    const nextCoordinate = [nextRow, column].toString();
    const nextCoordinateBlocked = region.east.has(nextCoordinate) || region.south.has(nextCoordinate);

    south.add(nextCoordinateBlocked ? coordinate : nextCoordinate);
    changed = changed || !nextCoordinateBlocked;
  }

  return { south, changed };
}

module.exports = {
  /**
   * O(e + s) time and space, where e is the number of east-facing cucumbers and s is the south-facing ones
   *
   * @param input
   * @returns {number}
   */
  part1: function(input) {
    const { region, width, height } = parseInput(input);

    let numSteps = 0;
    let movedRegion = region;

    while (true) {
      movedRegion = move(movedRegion, width, height);
      numSteps += 1;
      if (!movedRegion.changed) {
        break;
      }
    }

    return numSteps;
  },

  part2: function() {
    return 'Merry Christmas!';
  }
};
