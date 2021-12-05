# advent-of-code-2021
My solutions for the Advent of Code puzzles for 2021 https://adventofcode.com/2021

# Advent of Code 2019

These are my solutions for the [2021 Advent of Code puzzles](https://adventofcode.com/2021). This is just a way for me
to practice JavaScript.

## Requirements

1. Node 16 or higher
2. NPM 6 or higher

## Setup

All you need to do is install the dependencies with npm

```bash
$ npm install
```

## Running

Once the project is installed, just use `node` to run `aoc.js` to see a puzzle's solution.

To run Day 1, Part 1 with the input I received:

```bash
$ node aoc.js 1 1
```

## Goals

My goals for the puzzles this year are:

- Decent-to-good usage of the standard library
- No packages
- The best time and space complexity I can manage
- Readable solutions
    - Well named functions
    - Well named variables
    - Self documenting style
- Develop a decent function library for re-use
- Little-to-zero Googling

I realize I will not 100% nail these goals with every single puzzle, but these are what will drive how my solutions come
together.

## Notes

Within the comments of each file I'll be capturing some very simple notes about the algorithm and space/time complexity.
In any notes that reference Big O notation, `n` will always refer to the number of lines or items in the puzzle input,
unless otherwise noted. Time and space complexity notes will ignore overhead from loading the file into memory and any
input parsing.

### Puzzles

Here are my thoughts or lessons learned from the puzzles.

#### Day 1 ([puzzle](https://adventofcode.com/2021/day/1), [solution](./src/solution/day01.js))

Pretty simple problem. I've found over the years that many of the AOC puzzles sort of demand what I'll call "curosr
management" in that loops often need to consider multiple indexes while iterating over collections.
