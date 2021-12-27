/**
 * An ALU
 * @typedef {{w: number, x: number, y: number, z: number}} ALU
 */
/**
 * A program instruction
 * @typedef {{fn: function, args: *[]}} Instruction
 */
/**
 *
 * @param {string} input
 * @returns {Instruction[]}
 */
function parseInput(input) {
  return input.split('\n').map(line => {
    const [fn, ...args] = line.split(' ');
    return { fn, args };
  });
}

/**
 * A Maybe functor/monad thing /shrug
 *
 * @param value
 * @returns {any}
 * @constructor
 *
 * @see https://modernweb.com/a-gentle-introduction-to-monads-in-javascript/
 */
const Maybe = function(value) {
  const Nothing = {
    bind: fn => this,
    isNothing: () => true,
    val: () => {
      throw new Error("cannot call val() on nothing")
    },
    maybe: (def, fn) => def
  };

  const Something = function(value) {
    return {
      bind: fn => Maybe(fn.call(this, value)),
      isNothing: () => false,
      val: () => value,
      maybe: (def, fn) => fn.call(this, value)
    };
  };

  if (typeof value === 'undefined' || value === null) return Nothing;

  return Something(value);
};

/**
 *
 * @param {ALU} alu
 * @param {string} value
 * @returns {number}
 */
function valueOf(alu, value) {
  if (alu.hasOwnProperty(value)) {
    return alu[value];
  }
  return Number(value);
}

function getInstructions(input) {
  const inputValues = input.toString().split('').map(Number);
  return {
    inp: variable => alu => ({ ...alu, [variable]: inputValues.shift() }),
    add: (a, b) => alu => ({ ...alu, [a]: alu[a] + valueOf(alu, b) }),
    mul: (a, b) => alu => ({ ...alu, [a]: alu[a] * valueOf(alu, b) }),
    eql: (a, b) => alu => ({ ...alu, [a]: Number(alu[a] === valueOf(alu, b)) }),
    div: (a, b) => alu => ({ ...alu, [a]: Math.floor(alu[a] / valueOf(alu, b)) }),
    mod: (a, b) => alu => ({ ...alu, [a]: alu[a] % valueOf(alu, b) }),
  }
}

/**
 * Given an input, an initial ALU, and an ALU program, run the program and return the end state of the ALU
 *
 * @param {number|string} input
 * @param {ALU}  alu
 * @param {Instruction[]}  program
 * @returns {*}
 */
function runProgram(input, alu, program) {
  const instructions = getInstructions(input);
  return program
    .reduce((prev, { fn, args }) => prev.bind(instructions[fn](...args)), Maybe(alu))
    .maybe('???', s => s);
}

module.exports = {
  part1: function(input) {
    const program = parseInput(input);
    const alu = {w: 0, x: 0, y: 0, z: 0};
    const modelNumber = 92969593497992;

    return runProgram(modelNumber, alu, program).z;
  },

  part2: function(input) {
    const program = parseInput(input);
    const alu = {w: 0, x: 0, y: 0, z: 0};
    const modelNumber = 81514171161381;

    return runProgram(modelNumber, alu, program).z;
  }
};
