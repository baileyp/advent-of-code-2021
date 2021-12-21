const { neighbors, range, repeatFunction } = require("../lib/functions");

const LIT = '#';
const DARK = '.';
const ALL_DARK = 0;
const ALL_LIT = 511;

/**
 * Parse the puzzle input into an image enhancement algorithm and the initial image
 *
 * @param {string}  input
 * @returns {{image: Image, algorithm: Map<number, string>}}
 */
function parseInput(input) {
  const [algorithm, rawImage] = input.split('\n\n');
  const image = new Image();

  rawImage.split('\n').forEach((line, row) => {
    line.split('').forEach((pixel, column) => {
      if (pixel === LIT) {
        image.lightUp(column, row);
      }
    });
  });

  return { algorithm: new Map(algorithm.split('').entries()), image };
}

/**
 * Image implementation that stores the locations of lit pixels and the state of the surrounding field
 */
class Image {
  /**
   * Constructor
   */
  constructor() {
    this.litPixels = new Set();
    this.rowMin = 0;
    this.rowMax = 0;
    this.colMin = 0;
    this.colMax = 0;
    this.field = DARK;
  }

  /**
   * Light up the pixel at the given location
   *
   * @param {number}  column  The column or x coordinate
   * @param {number}  row     The row or y coordinate
   */
  lightUp(column, row) {
    this.rowMin = Math.min(row, this.rowMin);
    this.rowMax = Math.max(row, this.rowMax);
    this.colMin = Math.min(column, this.colMin);
    this.colMax = Math.max(column, this.colMax);
    this.litPixels.add([column, row].toString());
  }

  /**
   * Determine if the pixel at the given location is lit or not. Field state is considered.
   *
   * @param {number}  column  The column or x coordinate
   * @param {number}  row     The row or y coordinate
   * @returns {boolean}
   */
  isLit(column, row) {
    const colOutOfBounds = column < this.colMin || column > this.colMax;
    const rowOutOfBounds = row < this.rowMin || row > this.rowMax;
    if (colOutOfBounds || rowOutOfBounds) {
      return this.field === LIT;
    }
    const coordinate = [column, row].toString();
    return this.litPixels.has(coordinate);
  }

  /**
   * Iterate over all of the image's pixels plus a border of 1 all the way around
   *
   * @returns {Generator<{lit: boolean, column: number, row: number}, void>}
   */
  *[Symbol.iterator]() {
    for (const row of range(this.rowMin - 1, this.rowMax + 1)) {
      for (const column of range(this.colMin - 1, this.colMax + 1)) {
        yield { column, row, lit: this.litPixels.has([column, row].toString()) };
      }
    }
  }

  /**
   * The "size" of this image which is the number of lit pixels, excluding the infinite field
   *
   * @returns {number}
   */
  get size() {
    return this.litPixels.size;
  }
}

/**
 * Convert a string of lit/unlit pixels to a decimal number representation, where lit pixels represent binary 1s and
 * dark pixels represent binary 0s
 *
 * @param {string}  pixels  Pixel string representing a binary number
 * @returns {number}        The pixel string as decimal number
 */
function pixelsToDecimal(pixels) {
  const binary = pixels.replaceAll(DARK, '0').replaceAll(LIT, '1');
  return parseInt(binary, 2);
}

/**
 * Enhance an image according to the algorithm
 *
 * @param {Image}   image
 * @param {Map}     algorithm
 *
 * @returns {Image}
 */
function enhance(image, algorithm) {
  const enhanced = new Image();

  for (const { column, row } of image) {
    let index = '';
    for (const neighbor of neighbors(column, row, true)) {
      index += image.isLit(neighbor.column, neighbor.row) ? LIT : DARK;
    }

    if (algorithm.get(pixelsToDecimal(index)) === LIT) {
      enhanced.lightUp(column, row);
    }
  }

  if (image.field === DARK && algorithm.get(ALL_DARK) === LIT) {
    enhanced.field = LIT;
  }

  if (image.field === LIT && algorithm.get(ALL_LIT) === DARK) {
    enhanced.field = DARK;
  }

  return enhanced;
}

module.exports = {
  /**
   * O(n * t) time and O(n) space where n is the number of lit pixels and t is the number of times to apply the
   * enhancement algorithm.
   *
   * Note that n grows (unpredictably?) with every iteration of t - not entirely sure how to document that.
   *
   * @param {string}  input           Raw puzzle input with an enhancement algorithm and initial image
   * @param {number}  numEnhancements Number of times to apply the enhancement algorithm
   * @returns {number}                Number of lit pixels in the enhanced image
   */
  part1: function(input, numEnhancements = 2) {
    const { algorithm, image } = parseInput(input);
    let enhanced = image;

    repeatFunction(() => {
      enhanced = enhance(enhanced, algorithm);
    }, numEnhancements);

    return enhanced.size;
  },

  /**
   * @see Part 1
   */
  part2: function(input) {
    return module.exports.part1(input, 50);
  }
};
