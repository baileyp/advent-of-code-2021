#!/usr/bin/env node
const yargs = require('yargs/yargs');
const fs = require('fs');
const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .demandCommand(2)
  // .alias('i', 'input')
  // .describe('i', 'Use this argument as the input')
  // .alias('f', 'input-is-file')
  // .describe('f', 'Flag the input as a file path')
  // .boolean(['f'])
  .example('$0 1 1', 'Run Day 1, Part 1 with the default input')
  // .example('$0 1 1 -i abcd', 'Run Day 1, Part 1 with "abcd" as the input')
  // .example('$0 1 1 -if file.txt', 'Run Day 1, Part 1 with the contents of file.txt as the input')
  .epilog('Happy Coding!')
  .argv;

const Command = function(spec) {
  const day = parseInt(spec._[0]);
  const part = parseInt(spec._[1]);

  if (day < 1 || day > 25) {
    throw new Error("Day must be number 1 through 25");
  }

  if (part < 1 || part > 2) {
    throw new Error("Part must be 1 or 2");
  }

  return Object.freeze({
    day,
    part,
  });
}

try {
  const command = Command(argv);
  const day = command.day.toString().padStart(2, '0');
  const part = `part${command.part}`;
  const inputFile = `./resources/day${day}.txt`;

  const runner = function(input) {
    return require(`./src/solution/day${day}.js`)[part](input);
  };

  fs.readFile(inputFile, 'utf8' , (err, data) => {
    if (err) {
      throw err;
    }
    const puzzleResult = runner(data.trim(" \n"));
    console.log(puzzleResult);
    process.exit(0);
  });
}
catch (e) {
  console.error(e.message);
  process.exit(1);
}
