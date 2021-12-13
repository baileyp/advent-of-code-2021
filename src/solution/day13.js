const { DefaultMap } = require("../lib/classes");
const { range } = require("../lib/functions");

/**
 * Parse the puzzle input into a page (a grid representing dot locations) and a series of folds
 *
 * @param {string}  input
 * @returns {{folds: {line: number, axis: string}[], page: DefaultMap<number, Set<number>>}}
 */
function parseInput(input) {
  const [rawPoints, rawFolds] = input.split("\n\n");

  const page = blankPage();
  rawPoints.split("\n").forEach(coordinate => {
    const [x, y] = coordinate.split(',').map(number => parseInt(number));
    page.get(y).add(x);
  });

  const folds = rawFolds.split("\n").map(fold => {
    const { axis, line } = fold.match(/(?<axis>[xy])=(?<line>\d+)/).groups;
    return { axis, line: parseInt(line) };
  });

  return { folds, page };
}

/**
 * Create a blank page
 *
 * @returns {DefaultMap<*, Set>}
 */
function blankPage() {
  return new DefaultMap(() => new Set());
}

/**
 * Execute a fold on a page. A fold factory!
 *
 * @param {DefaultMap<number, Set<number>>}   page  The page to fold
 * @param {{line: number, axis: string}}      fold  The fold to execute
 * @returns {DefaultMap<number, Set<number>>}       The page after the fold has been executed
 */
function foldPage(page, fold) {
  const { axis, line } = fold;
  return ('x' === axis ? xFold : yFold)(page, line);
}

/**
 * Fold a coordinate value across a fold line
 *
 * @param {number}  value The value before folding
 * @param {number}  line  The line to fold over
 * @returns {number}      The value after folding
 */
function foldCoordinate(value, line) {
  return value < line ? value : value - 2 * (value - line);
}

/**
 * Execute a y-axis fold on a page at a line
 *
 * @param {DefaultMap<number, Set>} page  The page to fold
 * @param {number}                  line  The y-axis to fold over
 * @returns {DefaultMap<number, Set>}     The folded page
 */
function yFold(page, line) {
  const folded = blankPage();
  Array.from(page.entries())
    .map(([y, xes]) => [foldCoordinate(y, line), xes])
    .forEach(([y, xes]) => xes.forEach(x => folded.get(y).add(x)));
  return folded;
}

/**
 * Execute an x-axis fold on a page at a line
 *
 * @param {DefaultMap<number, Set>} page  The page to fold
 * @param {number}                  line  The x-axis to fold over
 * @returns {DefaultMap<number, Set>}     The folded page
 */
function xFold(page, line) {
  const folded = blankPage();
  Array.from(page.entries())
    .map(([y, xes]) => [y, Array.from(xes.values()).map(x => foldCoordinate(x, line))])
    .forEach(([y, xes]) => xes.forEach(x => folded.get(y).add(x)));
  return folded;
}

module.exports = {
  /**
   * O(n) space and time, where n is the number of dots in the input.
   *
   * @param {string}  input Raw puzzle input in two parts where the first part is a series of dot locations on a page in
   *                        "x,y" format per line, and then a series of folds to execute in
   *                        "fold along axis {axis}={line}" format per line
   * @returns {number}      The total number of dots visible after executing the first fold
   */
  part1: function(input) {
    const { folds, page } = parseInput(input);

    return Array.from(foldPage(page, folds[0]).values())
      .reduce((totalDots, nextLine) => totalDots + nextLine.size, 0);
  },

  /**
   * O(n * f) time and O(n) space where n is the number of dots in the input and f is the number of folds.
   *
   * @param {string}  input Raw puzzle input in two parts where the first part is a series of dot locations on a page in
   *                        "x,y" format per line, and then a series of folds to execute in
   *                        "fold along axis {axis}={line}" format per line
   * @returns {string}      A matrix representation of the message visible on the paper after executing all folds
   */
  part2: function(input) {
    const { folds, page } = parseInput(input);

    let folded = page;
    folds.forEach(fold => folded = foldPage(folded, fold));

    let output = '';
    for (const y of range(0, Math.max(...folded.keys()))) {
      for (const x of range(0, Math.max(...folded.get(y)))) {
        output += folded.get(y).has(x) ? '#' : ' ';
      }
      output += "\n";
    }
    return output;
  }
};
