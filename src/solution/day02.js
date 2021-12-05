/**
 * Convert a raw input line into a simple command object
 *
 * @param {string} line
 * @returns {Readonly<{distance: number, direction: string}>}
 */
const parseCommand = (line) => {
  const parts = line.split(" ");
  return Object.freeze({
    direction: parts[0],
    distance: parseInt(parts[1])
  });
}

module.exports = {
  /**
   * O(n) time and O(1) space
   *
   * @param {string} input  Each line is a command with a direction and a distance i.e., "forward 3"
   * @returns {number}      The product of the resulting position
   */
  part1: function(input) {
    const commands = input.split("\n")
      .map(parseCommand);

    const position = { horizontal: 0, depth: 0 };
    const moves = {
      forward: distance => position.horizontal += distance,
      up: distance => position.depth -= distance,
      down: distance => position.depth += distance
    };

    commands.forEach(command => {
      moves[command.direction](command.distance);
    });

    return position.horizontal * position.depth;
  },

  /**
   * O(n) time and O(1) space
   *
   * @param {string} input  Each line is a command with a direction and a distance i.e., "forward 3"
   * @returns {number}      The product of the resulting position based on new rules
   */
  part2: function(input) {
    const commands = input.split("\n")
      .map(parseCommand);

    const position = { horizontal: 0, depth: 0, aim: 0 };
    const moves = {
      forward: distance => {
        position.horizontal += distance;
        position.depth += position.aim * distance;
      },
      up: distance => position.aim -= distance,
      down: distance => position.aim += distance
    };

    commands.forEach(command => {
      moves[command.direction](command.distance);
    });

    return position.horizontal * position.depth;
  }
};
