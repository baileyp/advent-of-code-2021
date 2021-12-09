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

#### Day 7 ([puzzle](https://adventofcode.com/2021/day/7), [solution](./src/solution/day07.js))

Maths! I admit I got a little lucky aided in part by a little intuition. This just *felt* like a math problem and
guessed that the ideal position was the arithmetic median, so I typed that up, ran it, and turns out I was right. 

When I got to part two it was clear that the average, or arithmetic mean, was the answer for the ideal position. Well,
at least that's what I thought. It then occurred to me that the average was probably a decimal and either of that the
two adjacent integers were likely to be the ideal position, so I'd just have to calculate for both and return the
smaller result.

The last trick was efficiently getting the fuel consumption per crab submarine, the name for of which I didn't immediately
remember but [found](https://math.stackexchange.com/questions/593318/factorial-but-with-addition/593323) by googling
"math factorial but addition."

#### Day 8 ([puzzle](https://adventofcode.com/2021/day/8), [solution](./src/solution/day08.js))

If you summed up my time working on this puzzle, I'd say about 30% reading and re-reading the requirements, 5% working
on part one, and 65% working on part two. There was definitely a lot of material to take in here, and part one was so
simple and ignored most of the puzzle input, I braced myself for part two.

It took a bit of time to figure out what approach I wanted to take, but it seemed clear this was going to involve set
comparison, and this is yet another area where JavaScript's standard library let me down. I don't think I should have to
write my own class or functions for things like union, intersection, and difference of sets. Still, it was the approach
that made the most sense to me, so I [implemented my own class](./src/lib/classes.js#L24) for it.

#### Day 9 ([puzzle](https://adventofcode.com/2021/day/9), [solution](./src/solution/day09.js))

I enjoyed this, even if it was a bit simple. Or maybe I've just become accustomed to the demands of coordinate-based
puzzles? Either way, I was not stumped along the way but felt again frustrated as I did in Day 5 by not being able to
use object literals as fungible values.

```js
const foo = new Set();
foo.add({});
foo.add({});
// foo.size === 2
```

This doing what *I* want it to would make me happy.
