const { DefaultMap } = require('../lib/classes');

/**
 * Parse the input into sets of coordinate points
 *
 * @param {string}  input
 * @returns {{x: number, y: number}[][]}
 */
function parseInput(input) {
  return input.split("\n")
    .map(line => {
      return line.split(" -> ")
        .map(coordinate => {
          const [x, y] = coordinate.split(',').map(number => parseInt(number))
          return { x, y };
        });
    });
}

/**
 * Given two values, determine the step required to walk from the first value to the second value
 *
 * @param {number} value1
 * @param {number} value2
 * @returns {number}
 */
function determineStep(value1, value2) {
  if (value1 === value2) {
    return 0;
  }
  return value1 > value2 ? -1 : 1;
}

/**
 * Given a set of start & end plots, expand those into sets of plots representing all points in-between, inclusive
 * of the start and end.
 *
 * @param {{x: number, y: number}[][]}  lines             Array of vent lines organized as start/end coordinate pairs
 * @param {boolean}                     excludeDiagonals  When generating fully-plotted lines, exclude any lines on a
 *                                                        diagonal
 * @returns {number[][]}                                  Array of vent lines organized as full sets of coordinates
 */
function fillLines(lines, excludeDiagonals = true) {
  const filledLines = [];
  lines.forEach(([lineStart, lineEnd]) => {
    const xStep = determineStep(lineStart.x, lineEnd.x);
    const yStep = determineStep(lineStart.y, lineEnd.y);
    const isDiagonal = xStep !== 0 && yStep !== 0;

    if (excludeDiagonals && isDiagonal) {
      return undefined;
    }

    const filledLine = [];
    let x = lineStart.x, y = lineStart.y;
    while (x !== lineEnd.x || y !== lineEnd.y) {
      filledLine.push({x, y});
      x += xStep;
      y += yStep;
    }
    filledLine.push(lineEnd);
    filledLines.push(filledLine);
  });
  return filledLines;
}

/**
 * Given an array of filled vent lines, plot each point to a map, keyed by coordinate and valued by number of
 * lines at that point.
 *
 * @param {number[][]}  plottedLines
 * @returns {Map<string, number>}
 */
function plotPoints(plottedLines) {
  const plottedPoints = new DefaultMap(() => 0);

  plottedLines.forEach(plottedLine => {
    plottedLine.forEach(({ x, y }) => {
      const key = `${x},${y}`;
      plottedPoints.set(key, plottedPoints.get(key) + 1);
    });
  });

  return plottedPoints;
}

module.exports = {
  /**
   * O(n) time and space, where n is the total number of points defined by the vent lines
   *
   * @param {string} input    Raw input where each line is a start/end coordinate pair expressed as "x1,y1 -> x2,y2"
   * @param excludeDiagonals  Exclude diagonal lines from counting
   * @returns {number}        Number of coordinate points where two or more vent lines overlap, excluding diagnoals
   */
  part1: function(input, excludeDiagonals = true) {
    const lines = parseInput(input);
    const filledLines = fillLines(lines, excludeDiagonals);
    const plottedPoints = plotPoints(filledLines);

    return Array.from(plottedPoints.values())
      .filter(count => count > 1)
      .length;
  },

  /**
   * O(n) time and space, where n is the total number of points defined by the vent lines
   *
   * @param {string} input    Raw input where each line is a start/end coordinate pair expressed as "x1,y1 -> x2,y2"
   * @returns {number}        Number of coordinate points where two or more vent lines overlap
   */
  part2: function(input) {
    return module.exports.part1(input, false);
  }
};
