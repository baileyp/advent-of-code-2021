const { repeatFunction } = require("../lib/functions");
const { DefaultMap } = require("../lib/classes");

/**
 * Parse the puzzle input into the polymer template and mapping of insertion rules
 *
 * @param input
 * @returns {{polymerTemplate: string, insertionRules: Map<string, string>}}
 */
function parseInput(input) {
  const [polymerTemplate, rawInsertionRules] = input.split("\n\n");

  const insertionRules = new Map(
    rawInsertionRules
      .split("\n")
      .map(rule => rule.split(" -> "))
  );

  return { polymerTemplate, insertionRules };
}

/**
 * Process a single evolution step for a polymer by applying the insertion rules
 *
 * @param {string}              polymer The current iteration of the polymer
 * @param {Map<string, string>} rules   A map of insertion rules
 * @returns {string}                    The next iteration of the polymer
 */
function processStep(polymer, rules) {
  let newPolymer = '';

  for (let cursor = 0, end = polymer.length - 1; cursor < end; cursor++) {
    const pair = polymer.substring(cursor, cursor + 2);

    newPolymer += polymer[cursor];
    if (rules.has(pair)) {
      newPolymer += rules.get(pair);
    }

    if (cursor === end - 1) {
      newPolymer += polymer[cursor + 1];
    }
  }

  return newPolymer;
}

/**
 * Count the number of occurrences of each element within a polymer
 *
 * @param {string}  polymer               The polymer to count up
 * @returns {DefaultMap<string, number>}  A map of element => count
 */
function countElements(polymer) {
  let counts = new DefaultMap(() => 0);

  for (const element of polymer) {
    counts.set(element, counts.get(element) + 1);
  }

  return counts;
}

module.exports = {
  /**
   * O((n - 1) * (2^s) + 1) time and space where n is the number of elements in the polymer template and s is the number
   * of steps to use.
   *
   * @param {string}  input The raw puzzle input where the first line is the template and lines 2-n are insertion rules
   *                        in the form of "pair -> insertion"
   * @returns {number}      The difference of the most comment element minus the least common element after 10 insertion
   *                        steps
   */
  part1: function(input) {
    const { polymerTemplate, insertionRules } = parseInput(input);

    let polymer = polymerTemplate;
    repeatFunction(() => {
      polymer = processStep(polymer, insertionRules);
    }, 10);

    const elementCounts = Array.from(countElements(polymer).values());

    return Math.max(...elementCounts) - Math.min(...elementCounts);
  },

  /**
   * O((n^2 - n) * s) time and O(n^2 - n) space where n is the number of elements in the polymer template and s is the
   * number of steps to use.
   *
   * @param {string}  input The raw puzzle input where the first line is the template and lines 2-n are insertion rules
   *                        in the form of "pair -> insertion"
   * @returns {number}      The difference of the most comment element minus the least common element after 40 insertion
   *                        steps
   */
  part2: function(input) {
    const { polymerTemplate, insertionRules } = parseInput(input);
    const pairCounts = new DefaultMap(() => 0);
    const elementCounts = new DefaultMap(() => 0);

    // Seed the pair counts from the template
    for (let cursor = 0, end = polymerTemplate.length - 1; cursor < end; cursor++) {
      const pair = polymerTemplate.substring(cursor, cursor + 2);
      pairCounts.set(pair, pairCounts.get(pair) + 1);
    }

    // Seed the element counts from the template
    for (const element of polymerTemplate) {
      elementCounts.set(element, elementCounts.get(element) + 1);
    }

    repeatFunction(() => {
      // Every evolution creates predictable behavior regarding element counts
      // Given the sample data NNCB, consider it as a map of pairs and counts, as well as element counts
      //    NN => 1      N => 3
      //    NC => 1      C => 2
      //    CB => 1      B => 1
      // When applying the insertion rule NN -> C the following changes happen to our map: NN -= 1, NC += 1, CN += 1
      // so the next iteration of the map looks like this
      //    NN => 0      N => 2
      //    NC => 2      C => 3
      //    CB => 1      B => 1
      //    CN => 1
      // Apply this process iteratively to solve the polymer evolution without mapping the entire solution of 2^40!
      Array.from(pairCounts.entries()).forEach(([pair, count]) => {
        const insertedElement = insertionRules.get(pair);
        const leftPair = pair[0] + insertedElement;
        const rightPair = insertedElement + pair[1];

        // First, subtract all occurrences of pair
        pairCounts.set(pair, pairCounts.get(pair) - count);

        // Then, for every occurrence of pair, increase occurrence of each new pair by 1
        pairCounts.set(leftPair, pairCounts.get(leftPair) + count);
        pairCounts.set(rightPair, pairCounts.get(rightPair) + count);

        // Finally, for every occurrence of pair, increase occurrence of the inserted element by 1
        elementCounts.set(insertedElement, elementCounts.get(insertedElement) + count);

        // If pair no longer exists, remove it from the map so it is not considered in the next iteration
        if (pairCounts.get(pair) < 1) {
          pairCounts.delete(pair);
        }
      });
    }, 40);

    const countValues = Array.from(elementCounts.values());

    return Math.max(...countValues) - Math.min(...countValues);
  }
};
