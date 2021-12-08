# Advent of Code 2021

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

#### Day 2 ([puzzle](https://adventofcode.com/2021/day/2), [solution](./src/solution/day02.js))

This was also simple, a pretty straight-forward coordinates-in-space problem. I considered implementing the position
as Value Objects but the stakes here are low here I just went for direct state manipulation.

#### Day 3 ([puzzle](https://adventofcode.com/2021/day/3), [solution](./src/solution/day03.js))

My entire career has been web development so really the only time I've every done work with binary math is in a test,
academic, or puzzle environment such as this. Suffice to say, I'm not great at it and the challenge this puzzle
presented shows it. I ended up writing a lot of code, which is a mix of binary math and just manipulating the binary
numbers as strings directly. Did my best to write sensible functions and symbol names, so although it's a lot of code
I think it's pretty easy to follow.

#### Day 4 ([puzzle](https://adventofcode.com/2021/day/4), [solution](./src/solution/day04.js))

I didn't find this too difficult but I can't pretend my solution is optimal. Still, it was easy to visualize, so I just
typed out my first mental model of the problem and it worked like a charm. It's perhaps a little brute-forcey, but I
don't mind since it runs fast and the code is easy to understand.

#### Day 5 ([puzzle](https://adventofcode.com/2021/day/5), [solution](./src/solution/day05.js))

I think the only "trick" to this one was the correct algorithm for determining all the coordinates covered by a line,
having been defined as just a start and an end. The rest was a simple mapping of coordinate to count. I was a little
frustrated by not being able to use object literals as fungible keys. For example:

```js
const foo = new Map();
foo.set({}, 1);
foo.set({}, foo.get({}, 1) + 1);
```

My expectation here is that the map has a single key of `{}` with a value of `2` but that's not what happens (you can
run it yourself to see the real result) which forced me to convert my point objects to a string to get the fungible
key behavior I needed. Anybody reading this who knows a different trick here, I'd love to know.

#### Day 6 ([puzzle](https://adventofcode.com/2021/day/6), [solution](./src/solution/day06.js))

I've done enough Advent of Code puzzles to know that when the puzzle description includes a word like "exponential" in
**bold** to know that a naive solution will probably work for part 1, but not for part 2, such as modeling a list of
all fish. This instinct not only turned out to be correct but drove me to think about the problem a little deeper, and I
ended up with a pretty tidy solution that runs in linear time and consumes constant space.
