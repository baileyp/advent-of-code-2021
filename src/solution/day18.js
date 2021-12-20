/**
 * Perform a single explode operation on the given snailfish number, if available
 *
 * @param {string}  number  A snailfish number represented as a string i.e., "[1,[2,3]]"
 * @returns {{number, split: boolean}}  The number after attempting an explode and whether or not it was performed
 */
function doExplode(number) {
  let depth = 0;
  let explodedNumber = '';
  let exploded = false;
  for (let i = 0; i < number.length; i++) {
    const char = number[i];
    if (char === '[') {
      explodedNumber += char;
      depth += 1;
      continue;
    }
    if (char === ']') {
      explodedNumber += char;
      depth -= 1;
      continue;
    }
    if (char === ',') {
      explodedNumber += char;
      continue;
    }

    if (depth === 5) {
      const { left, right } = number.substring(i).match(/(?<left>\d+)\,(?<right>\d+)/).groups;
      i += left.length + right.length + 1;

      const leftPattern = /(?<digit>\d+)(?<tail>\D+)$/;
      const leftMatch = explodedNumber.match(leftPattern);
      if (leftMatch) {
        const { digit, tail } = leftMatch.groups;
        explodedNumber = explodedNumber.replace(leftPattern, parseInt(digit) + parseInt(left));
        explodedNumber += tail;
      }
      explodedNumber = explodedNumber.replace(/.$/, '0');

      const rightPattern = /(?<digit>\d+)/;
      const rightMatch = number.substring(i).match(rightPattern);
      if (rightMatch) {
        explodedNumber += number.substring(i + 1)
          .replace(rightPattern, parseInt(rightMatch.groups.digit) + parseInt(right));
      } else {
        explodedNumber += number.substring(i + 1);
      }
      exploded = true;
      break;
    }
    explodedNumber += char;
  }
  return { number: explodedNumber, exploded };
}

/**
 * Perform a single split operation on the given snailfish number, if available
 *
 * @param {string}  number  A snailfish number represented as a string i.e., "[1,[2,3]]"
 * @returns {{number, split: boolean}}  The number after attempting a split and whether or not it was performed
 */
function doSplit(number) {
  const pattern = /(?<digit>\d\d+)/;

  let newNumber = number;
  let match = newNumber.match(pattern);
  let split = false;
  if (match) {
    const digit = parseInt(match.groups.digit);
    const left = Math.floor(digit / 2);
    const right = Math.ceil(digit / 2);
    newNumber = newNumber.replace(pattern, `[${left},${right}]`);
    split = true;
  }
  return { number: newNumber, split };
}

/**
 * Determine whether or not a given snailfish number can be further reduced
 *
 * @param {string}  number  A snailfish number represented as a string i.e., "[1,[2,3]]"
 * @returns {boolean}       True if the number can still be reduced
 */
function isReducible(number) {
  const digitsOver9 = number.match(/\d+/g).some(digit => digit.length > 1);
  if (digitsOver9) {
    return true;
  }

  let depth = 0;
  for (let i = 0; i < number.length; i++) {
    const char = number[i];
    if (char === '[') {
      depth += 1;
      continue;
    }
    if (char === ']') {
      depth -= 1;
      continue;
    }
    if (depth === 5) {
      return true;
    }
  }

  return false;
}

/**
 * Reduce a snailfish number
 *
 * @param {string}  number  A snailfish number represented as a string i.e., "[1,[2,3]]"
 * @returns {string}        The reduced version of the number
 */
function reduce(number) {
  let result = { number };

  do {
    do {
      result = doExplode(result.number)
    }
    while (result.exploded);

    result = doSplit(result.number);
  }
  while (isReducible(result.number));

  return result.number;
}

/**
 * Calculate the magnitude of a snailfish number
 *
 * @param {number|number[]}  number A whole or partial snailfish number
 * @returns {number}                The magnitude
 */
function magnitude(number) {
  if (typeof number === 'number') {
    return number;
  }
  const [left, right] = number;

  return 3 * magnitude(left) + 2 * magnitude(right);
}

module.exports = {
  /**
   * O(n * w) time and O(w) space where n is the quantity of numbers and w is the character width of the longest number
   *
   * @param {string}  input Raw puzzle input where each line is a snailfish number
   * @returns {number}      The magnitude of the sum of all snailfish numbers in the input
   */
  part1: function(input) {
    const numbers = input.split('\n');

    let number = numbers.shift();
    numbers.forEach(next => {
      number = reduce(`[${number},${next}]`);
    });

    return magnitude(JSON.parse(number));
  },

  /**
   * O(n^2 * w) time and O(n + w) space where n is the quantity of numbers and w is the character width of the longest
   * number
   *
   * @param {string}  input Raw puzzle input where each line is a snailfish number
   * @returns {number}      The largest magnitude possible from summing all permutations of the input numbers
   */
  part2: function(input) {
    let maxMagnitude = Number.MIN_SAFE_INTEGER;
    const numbers = input.split('\n');

    const getMagnitude = number => Math.max(maxMagnitude, magnitude(JSON.parse(reduce(number))));

    for (const x of [...numbers]) {
      for (const y of numbers) {
        maxMagnitude = getMagnitude(`[${x},${y}]`);
        maxMagnitude = getMagnitude(`[${y},${x}]`);
      }
    }

    return maxMagnitude;
  }
};
