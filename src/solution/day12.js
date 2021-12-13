const { DefaultMap } = require("../lib/classes");

/**
 * Parse the puzzle input into an adjacency list graph representation. Node relationships are bi-directional.
 *
 * @param {string}  input Each line is a relationship between two nodes in the format "node1-node2"
 * @returns {DefaultMap<string, string>}
 */
function parseInput(input) {
  const graph = new DefaultMap(() => []);
  input.split("\n").forEach(line => {
    const [parent, child] = line.split('-');
    graph.get(parent).push(child);
    graph.get(child).push(parent);
  });
  return graph;
}

module.exports = {
  /**
   * O(c + x) time and space where c is the number of caves and x is the number of connections between caves.
   *
   * @param {string}  input Raw puzzle input where each line represents a cave connection
   * @returns {number}      The number of distinct paths through the cave system
   */
  part1: function(input) {
    const graph = parseInput(input);
    let distinctPathCount = 0;

    function dfsVisit(cave, path = [], visited = new Set()) {
      if (cave === 'end') {
        distinctPathCount += 1;
        return;
      }

      const isBigCave = cave.toUpperCase() === cave;
      if (visited.has(cave) && !isBigCave) {
        return;
      }

      path.push(cave);
      visited.add(cave);

      graph.get(cave).forEach(nextCave => dfsVisit(nextCave, path, visited));

      visited.delete(cave);
      path.pop();
    }

    dfsVisit('start');

    return distinctPathCount;
  },

  /**
   * O((c + x) * p) time and O(c + x) space where c is the number of caves, x is the number of connections between
   * caves, and p is the length of the longest path.
   *
   * @param {string}  input Raw puzzle input where each line represents a cave connection
   * @returns {number}      The number of distinct paths through the cave system, allowing for second visits to small
   *                        caves
   */
  part2: function(input) {
    const graph = parseInput(input);
    let paths = 0;

    function dfsVisit(
      cave,
      path = [],
      visited = new Set(),
      secondVisit = undefined
    ) {
      if (cave === 'end') {
        paths += 1;
        return;
      }

      const isBigCave = cave.toUpperCase() === cave;
      if (visited.has(cave) && !isBigCave) {
        if (secondVisit) {
          return;
        }
        secondVisit = cave;
      }

      path.push(cave);
      visited.add(cave);

      graph.get(cave)
        .filter(nextCave => nextCave !== 'start')
        .forEach(nextCave => dfsVisit(nextCave, path, visited, secondVisit));

      visited.delete(cave);
      path.pop();

      if (secondVisit && path.filter(pathCave => pathCave === secondVisit).length === 1) {
        visited.add(secondVisit);
        secondVisit = undefined;
      }
    }

    dfsVisit('start');

    return paths;
  }
};
