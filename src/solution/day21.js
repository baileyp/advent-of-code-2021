const { range } = require("../lib/functions");
const { DefaultMap } = require("../lib/classes");

/**
 * Parse the input into the player's starting positions & scores
 *
 * @param {string}  input
 * @returns {{position: number, score: number}[]}
 */
function parseInput(input) {
  return input.split('\n').map(line => {
    const position = Number(line.split(' ').pop());
    return { position, score: 0 };
  });
}

/**
 * Generate a deterministic die that with each roll, produces a repeating, incremental sequence
 *
 * @param {number}  maxFaces
 * @param {number}  lowestFace
 * @param {number}  step
 * @returns {{roll: (function(): number)}}
 */
function deterministicDie(maxFaces = 100, lowestFace = 1, step = 1) {
  let face = lowestFace - step;
  return {
    roll: () => {
      face += step;
      if (face > maxFaces) {
        face = lowestFace;
      }
      return face;
    }
  }
}

module.exports = {
  /**
   * The space consumption here is O(1) but I'm really not sure of the time complexity.
   *
   * The minimum increment to a player's score per turn is 1, and 1000 is the win condition, so I suppose just
   * considering those terms the time is O(s) where s is the winning score needed. The sample data yield a win after 993
   * dice rolls, which is 331 turns, and my actual data yielded a win after 335 turns. So perhaps this can be expressed
   * as O(s / b / d) where s is the wining score, b is the the size of the board, and d is the number of die rolls per
   * turn? I can't really tell.
   *
   * In the strictest since, every solution to this puzzle is O(1) across the board since, of all the variables I
   * mentioned above, none of them come from the puzzle input, they're all fixed attributes of the game. Still, I think
   * just calling this O(1) and wiping my hands of it is just a bit intellectually dishonest.
   *
   * @param {string}  input Raw puzzle input describing the player's starting positions
   * @returns {number}      The total number of dice rolls times the loser's score
   */
  part1: function(input) {
    const players = parseInput(input);
    const die = deterministicDie();
    let rolls = 0;
    let turn = 1;

    const nextPlayer = () => {
      turn = Number(!turn);
      return players[turn];
    }

    do {
      const player = nextPlayer();
      rolls += 3;
      const roll = die.roll() + die.roll() + die.roll();
      player.position = ((player.position - 1 + roll) % 10) + 1;
      player.score += player.position;
    }
    while (players.every(player => player.score < 1000));

    const losingScore = players.reduce((score, player) => Math.min(score, player.score), Number.MAX_SAFE_INTEGER);

    return rolls * losingScore;
  },

  /**
   * Like part 1, how to document the time/space complexity here just depends on what you consider to be variable. The
   * number of universes per split? The number of faces on the die? The number of players?
   *
   * Consider variables m, which represents the number of discrete moves available from rolling the dice (in this case,
   * m=7) and s, which represents the winning score (in this case, 21).
   *
   * m is what the recursive loop is built on. It keeps running until a score of s is found. This suggests a time
   * complexity of m^s or 7^21 but this is demonstrably not true - that's over 550 quintillion! Something else
   * mathematical is happening here and I can't quite put my finger on it - probably something logarithmic.
   *
   * I did put a counter in this program and it consumed ~126 million iterations with the sample data and ~82 million
   * with my real data.
   *
   * @param {string}  input Raw puzzle input describing the player's starting positions
   * @returns {number}      The number of wins of the winningest player in the multiverse
   */
  part2: function(input) {
    const players = parseInput(input);

    // Three, three-sided die can only produce seven different moves (3-9), but there are multiple rolls that produce
    // the same, aggregate roll. This builds a map of how often those moves (rolls) can occur.
    const rollFrequency = new DefaultMap(() => 0);
    for (const first of range(1, 3)) {
      for (const second of range(1, 3)) {
        for (const third of range(1, 3)) {
          const roll = first + second + third;
          rollFrequency.set(roll, rollFrequency.get(roll) + 1);
        }
      }
    }

    /**
     * Count the number of wins per player based on their starting positions and player 1 going first.
     *
     * @param {number}  turn  A zero-based index of which player's turn it is
     * @returns {number[]}    The number of wins per player after this turn completes
     */
    const countWins = (turn = 0) => {
      const player = players[turn];

      // This is the end of the recursive call. If the previous turn generated a win for the player, this single
      // outcome will be multiplied back up the call stack by the number of universes that lead to this exact outcome.
      if (players[0].score >= 21) return [1, 0];
      if (players[1].score >= 21) return [0, 1];

      const winsPerPlayerThisTurn = [0, 0];

      // Try out each possible roll
      for (const roll of rollFrequency.keys()) {
        // Store the player's current position and score so it can be reset after the universe splits
        const currentPosition = player.position;
        const currentScore = player.score;

        // Advance the player and calculate their score per the game rules
        player.position = ((player.position - 1 + roll) % 10) + 1;
        player.score += player.position;

        // Determine how many universes are created by the current roll and how many wins each player will get from this
        // roll occurring. Their total wins from this turn is the product of both.
        const universesThisRoll = rollFrequency.get(roll);
        const winsPerPlayerThisRoll = countWins(Number(!turn));
        winsPerPlayerThisTurn[0] += winsPerPlayerThisRoll[0] * universesThisRoll;
        winsPerPlayerThisTurn[1] += winsPerPlayerThisRoll[1] * universesThisRoll;

        // Reset for calculating the next set of splits
        player.position = currentPosition;
        player.score = currentScore;
      }

      return winsPerPlayerThisTurn;
    }

    return Math.max(...countWins());
  }
};
