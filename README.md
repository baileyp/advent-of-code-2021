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
- Minimal Googling
- Well-written JSDocs

I realize I will not 100% nail these goals with every single puzzle, but these are what will drive how my solutions come
together.

## Notes

Within the comments of each file I'll be capturing some very simple notes about the algorithm and space/time complexity.
In any notes that reference Big O notation, `n` will always refer to the number of lines or items in the puzzle input,
unless otherwise noted. Time and space complexity notes will ignore overhead from loading the file into memory and any
input parsing into a programmatic representation.

### Puzzles

Here are my thoughts or lessons learned from the puzzles.

#### Day 1 ([puzzle](https://adventofcode.com/2021/day/1), [solution](./src/solution/day01.js))

Pretty simple problem. I've found over the years that many of the AOC puzzles sort of demand what I'll call "cursor
management" in that loops often need to consider multiple indexes while iterating over collections.

#### Day 2 ([puzzle](https://adventofcode.com/2021/day/2), [solution](./src/solution/day02.js))

This was also simple, a pretty straight-forward coordinates-in-space problem. I considered implementing the position
as Value Objects but the stakes here are low here I just went for direct state manipulation.

#### Day 3 ([puzzle](https://adventofcode.com/2021/day/3), [solution](./src/solution/day03.js))

My entire career has been web development so really the only time I've ever done work with binary math is in a test,
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
at least that's what I thought. It then occurred to me that the average was probably a decimal and either of the
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

Did I solve for all of the digits in the optimal order and in the optimal way? Probably not, but I won't lose sleep over
it.

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

#### Day 10 ([puzzle](https://adventofcode.com/2021/day/10), [solution](./src/solution/day10.js))

Stacks on stacks on stacks! Yet again where JavaScript's set of native collection types is woefully underpowered for
many tasks. This puzzle screamed for a double-ended queue??? but alas, the language does not have it. I considered writing
my own, but then I remembered I had to go to work today, so I just used an array and therefore ended up with a quadratic
time implementation due to the use of `Array.prototype.unshift()`.

Still, this puzzle was fun, and I decided to go with exceptions/errors as the mechanism for detecting corrupt or
incomplete lines. They made for good way to short-circuit a recursive loop *and* provide additional context back to the
original caller. There was some happy re-use of part 1 in part 2 and some *really* happy reuse of the `median()`
function I wrote for Day 7. I think there were several ways to match all the bracket types, but I just went with a pair
of arrays with indexed-matched values.

??? It has since come to my realization that a deque is actually *not* needed since this is also solvable iteratively. I
saw the inherent tree structure of the data and sort of instinctively went with a recursive solution (which would much
prefer a deque) which is one of those weird pitfalls of software design - perfectly sensible solutions can end up
looking like anti-patterns. Live and learn ????

#### Day 11 ([puzzle](https://adventofcode.com/2021/day/11), [solution](./src/solution/day11.js))

There's a [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) quality to this puzzle, having to
process a generation of change and then applying that change in two separate passes. It took a little finagling to get
the order of operations just right, and I ended up Doing Something That You Shouldn't??? and by that I mean modifying a
collection while in the middle of iterating that same collection. Still, in this exact instance there are no side
effects, so I'm sticking with it.

Sometimes part 2 just comes along and wallops you but today that was not the case. The legwork done for part 1 required
no changes for part 2, just a different invocation.

#### Day 12 ([puzzle](https://adventofcode.com/2021/day/12), [solution](./src/solution/day12.js))

???? ???? This is me on the struggle bus with today's puzzle.
As I've [mentioned](https://github.com/baileyp/advent-of-code-2018/blob/e4029a94a75f3825ac965ee44be1cbddacbd35f1/README.md#day-7)
[before](https://github.com/baileyp/advent-of-code-2020/blob/973d5463d81bc7e0d434c88b1d99fe5c5e1655e7/README.md#day-7-puzzle-solution)
, I'm not great at graph problems. Still, I've gotten a bit better over the years but the main source of today's
struggle was actually a misinterpretation of the requirements. I (very foolishly) assumed that the puzzle input was
going to model all nodes *and* edges **with** their direction - which was terribly wrong. I wasted a good hour with a
step debugger all pinned on this bad assumption. I just didn't read carefully and was too quick to get to coding.

At any rate, after I disabused myself of this assumption, the code came together neatly and was a quite simple DFS
implementation. Well, at least for part 1.

Part 2 stumped me. Yet again I was bit here by a misunderstanding of the new requirement - I thought "single small cave"
meant the little dead-ends, like cave `c` in the sample data - not that *any* small cave could be visited twice per
distinct journey.

I don't *love* my solution for adjusting to this requirement. It's clunky and the growth in time complexity does not
make me happy, but I had already spent enough time on this puzzle and just went with something that works - an
adjustment I will admit was built by step-debugging, not by reasoning out the solution in my head. Still, it runs quite
quickly so despite the hack, added to my weakness at graph problems, I'm pleased.

#### Day 13 ([puzzle](https://adventofcode.com/2021/day/13), [solution](./src/solution/day13.js))

I experimented today with a different way of representing a grid in space that really only works for "does this point
exist" data, which has a nice synergy with this puzzle in the context of overlapping dots. The implementation is a `Map`
where the keys are the `y` axis, and the values are `Set`s of the `x` axis. Works pretty well and certainly keeps space
consumption tidy, but it did lend to maybe a slightly awkward algorithm to print out the result in part 2.

I did not find this challenging, 'twas just a bit of math to transpose the coordinates over the fold lines (maybe there
is some fancy matrix operation for this?), but I'm happy to keep getting re-use out of my little function/class library
that has been building up. **Side Note:** while, when writing the notes here, I'm generally not ever concerned with the
algorithms and processing required to parse the input into some sort of programmatic representation, it was nice to make
use of [named capturing groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges#using_named_groups)
while working with pattern matching - really goes to aid readability IMO.

#### Day 14 ([puzzle](https://adventofcode.com/2021/day/14), [solution](./src/solution/day14.js))

Today was bound to happen. I was stumped. I solved part 1 just fine - which I left untouched in my committed code. But
that solution just crashed and burned running part 2. When looking at the time/space complexity, it's easy to see why.

Consider what `O((n - 1) * (2^s) + 1)`??? really means given the actual inputs at play here. Re-written as a mathematical
function, the complexity can be represented as

> *f(n, s) = (n - 1) x 2?? + 1*

Given the actual inputs for part 1, this represents as:

> *f(20, 10) = 19,457*

Just under 20k - not a problem.

And with the actual inputs for part 2:

> *f(20, 40) = 20,890,720,927,745*

Nearly *21 trillion*!!!

It was obvious to me at this point that modeling the whole solution space was not possible, I just couldn't work out
what I had to model instead. Therefore, today was the first time I hit up 
[Reddit](https://www.reddit.com/r/adventofcode/comments/rfzq6f/2021_day_14_solutions/) for hints. I didn't want to find
solutions, I just wanted a nugget of something to get my brain working in a different context. While scrolling I saw the
word "lanternfish" and immediately remembered that was part of [another day's puzzle](#day-6-puzzle-solution). I looked
up my own solution and found that I was modeling counts per age for that one...

Counts per age...

Counts per age...

*COUNTS PER ELEMENT!!!*

Wait, but I still need to figure out how to track insertions. Looking back at the sample data and trying to reason more
about what was happening at each step, I finally figured it out. Every pair always generates a new letter (i.e., an
increment to that letter's count) so then it was a matter of keeping track of which pairs existed. Once I settled on
modeling the counts of each letter *and* of each pair, the solution came together pretty quickly. Due to all of this, I
did heavily document the code this time around, as a reminder to myself and as a way to hopefully make this type of
algorithmic trick stick in my brain.

Looking at the new time complexity, it's also no wonder that this runs super quickly

> O((n^2 - n) * s)
> 
> *f(n, s) = (n?? - n) x s*
> 
> *f(20, 40) = 15,200*

That's less time than the algorithm + inputs for part 1!

??? I realize that in proper Big-O notation you don't write constants like `+ 1` and so forth, but since I bothered to
work out what the real mathematical complexity was, I wanted to capture it. The correct notation here, I believe, is
`O(n * 2^s)`.

#### Day 15 ([puzzle](https://adventofcode.com/2021/day/15), [solution](./src/solution/day15.js))

Well, just like yesterday, today was bound to happen as well. I don't know pathfinding algorithms *at all* but I did
know that BFS was probably a good start. I tried a BFS solution for a while and just kept getting stuck. After hitting
[the Reddit thread](https://www.reddit.com/r/adventofcode/comments/rgqzt5/2021_day_15_solutions/) and reading around a
bit, I learned a few things.

1. There were lots of people using very specific pathfinding algorithms like Djikstra and A\*.
2. This also seems to be a Dynamic Programming problem which is something I understand when reading academically, but
   never see it as an implementation pattern.
3. While I feel very comfortable with DFS, I rarely (read: never) have a case to use/practice BFS so even my first stab
   at implementing it wasn't great.

I didn't want to stray far from my initial thought (BFS) so I found some reference solutions and adapted one to what I
had already started writing. I'll spare you the details of the iterations I went through but the big thing I was missing
was sorting of the queue, plus the occasional x/y row/column mixup. I ran it with the test input and got `40` so then I
tried with my actual puzzle input, and it yielded the correct answer. Great! Except that I didn't totally understand how
it worked, so I stepped through the algorithm in my head (and a bit on paper) and started to get a sense of it and
documented what I could in my code. I think I now understand BFS about 1000% more than I did this morning???.

Part 2 might have a trick, but I just wrote a tiler for the original cave grid, which was not complicated, and re-ran it
through the pathfinder and *Robert's Your Mother's Brother*.

??? Editor's Note: All of which I will probably forget by next year's AoC.

#### Day 16 ([puzzle](https://adventofcode.com/2021/day/16), [solution](./src/solution/day16.js))

I immediately got a [2018 Day 8](https://github.com/baileyp/advent-of-code-2018#day-8) vibe (yes, I remembered that -
it's how my brain works, ok?) from this puzzle. Based on that, plus my comfortability with OOP, I set out to write some
classes to represent packets - yes, even knowing that
[Papa Crockford doesn't like classes](https://www.youtube.com/watch?v=XFTOG895C7c) - and they came together pretty
easily. And while I definitely had to spend some time making sure I didn't get into Magic Int Hell???, I had something in
place that *should* work. And it did! 

Except it didn't. It worked only for the test input, and failed miserably on the real input. After pulling out a few
hairs and some step debugging, I found that I wasn't properly calculating the packet length for operator packets of
length type '1' which - perhaps nefariously - didn't present as a problem with the test input. At any rate, once I fixed
that it was smooth sailing, even through part 2 which was a cinch to implement with the model I already had in place.

#### Day 17 ([puzzle](https://adventofcode.com/2021/day/17), [solution](./src/solution/day17.js))

I had a real fun *A-HA!* moment with part 1. Since the goal was to find the highest arcing shot, the best `y` was
obviously going to be a positive number. Also, there are a few interesting facts that we can derive from the linear
acceleration/deceleration of a shot:

1. Every upwards shot is guaranteed to come back down at exactly `y=0` before continuing negative
2. Therefore, the height reached by initial velocity `y` is just the `y`th triangle number
   (thank you [Day 7!](#day-7-puzzle-solution))
3. This also means the highest shot will also be the fastest moving shot by the time it reaches `y=0`, meaning it would
   go from `y=0` to `y=minY` in a single step, making `minY` (as an absolute value) the `y + 1`th triangle number.

Given all of the above, the solution is just a simple math problem that only needs a single value from the target area -
very cool!

Part 2 might have a math trick as well - parabolas or some other - but hey, I'm programmer not a mathematician. Still,
using some related knowledge I was able to narrow down the solution space to something reasonable, and then I just
simulated every shot within those boundaries, which was not complicated.

#### Day 18 ([puzzle](https://adventofcode.com/2021/day/18), [solution](./src/solution/day18.js))

*Ouch.* This puzzle kicked my butt. I spent hours across several days trying to get a recursive/graph solution working
and I just couldn't find the right algorithm that would manage exploding numbers correctly. I could get it to work for
some scenarios, but not all. Let me try to explain.

Consider this snailfish sum from the sample data:

```
  [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
+ [7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
= [[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]] (before reduction)
```

As a graph, it looks like this (depth along the y axis):

```
0 |                  _________ + _________
  |                 /                     \
1 |          _____ L ______           ____ R ___
  |         /              \         /          \
2 |      _ L _            _ R _     7       ____ R ____
  |     /     \          /     \           /           \   
3 |    L       R        L       R         L             R     
  |   / \     / \     /   \    / \      /   \         /   \   
4 |  0   R   0   0   L     R  9   5    L     R       L     R  
  |     / \         / \   / \         / \   / \     / \   / \ 
5 |    4   5       4   5 2   6       3   7 4   3   6   3 8   8
```

After the first explosion, it becomes this

```
0 |                  _________ + _________
  |                 /                     \
1 |          _____ L ______           ____ R ___
  |         /              \         /          \
2 |      _ L _            _ R _     7       ____ R ____
  |     /     \          /     \           /           \   
3 |    L       R        L       R         L             R     
  |   / \     / \     /   \    / \      /   \         /   \   
4 |  4   0   5   0   L     R  9   5    L     R       L     R  
  |                 / \   / \         / \   / \     / \   / \ 
5 |                4   5 2   6       3   7 4   3   6   3 8   8
```

Which my recursive/graph approach managed, but now enters the problem. The next node to explode `L,R,L,L` value of `4,5`
which splits to left of `4` and right of `5`. Now, the `4` needs to be added to a leftwards tree at `L,L,R,R` value of
`0`, that, in a recursive approach *had already completed processing*. There was no "walk that part of the graph" again
code path available. I think I could have done it in a second pass - a sort of post-processing - but the state
management just seemed like a nightmare.

So, I gave up and just wrangled the explodes, splits, and most other operations on the string representations directly.
The code is ugly, but it's fairly fast and, once I got it working, implementing part 2 was trivial.

#### Day 19 ([puzzle](https://adventofcode.com/2021/day/19), [solution](./src/solution/day19.js))

Nope. Not yet.

#### Day 20 ([puzzle](https://adventofcode.com/2021/day/20), [solution](./src/solution/day20.js))

[*Zoom and enhance!*](https://knowyourmeme.com/memes/zoom-and-enhance)

This one was kinda fun. I understood it to be another [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
style puzzle from the get-go, but I also knew something was lurking by the mention of the infinite field. Took me a
while to realize a few things about this:

1. That the infinite field is not just inert space for the image to grow into (my original understanding) but that it
   also has to be processed by the algorithm.
2. The enhancement behavior of the field was predictable based on the algorithm indexes of `.........` (decimal `0`) and
   `#########` (decimal `511`), respectively. Basically, given the right conditions, the entire field will toggle from
   dark to lit or vice-versa.
3. The sample data does not trigger a change to the field as described above, but the actual puzzle input does.

Once I came to understand these things, the rest was just implementation. I went for a custom object to implement the
image and did everything I could think of to optimize time and space:

- Using a `Set` to store just the locations of the lit pixels to both keep the space tidy and allow puzzle answers to be
  calculated in constant time.
- Keeping track of the image boundary at "pixel insertion" time so as to avoid calculating it later.
- Generator for iteration.
- The state of the infinite field is represented by a single value.

I also implemented the algorithm as a `Map` for O(1) lookups because I was unsure about the time-complexity of bracket
notation for accessing string indexes, and the time complexity of `String.prototype.charAt()`
[seems to be unclear](https://stackoverflow.com/questions/60007042/does-javscripts-string-charat-method-have-o1-time-complexity).

Even with all that, part 2 still took about 5 seconds on my 2017 i5 MBP so about 100ms per enhancement.

It was kind of fun to implement JavaScript's iterator protocol on a class, and I also had to tweak my `neighbors`
library function to yield results in a specific order (previously callers didn't care) as well as a tweak to include
the origin coordinate in the yielded values.

Given how difficult day 18 was for me and that - at this time - I've completely skipped day 19, this was satisfying.

#### Day 21 ([puzzle](https://adventofcode.com/2021/day/21), [solution](./src/solution/day21.js))

I have no shame admitting today's puzzle was over my head. Not part 1, mind you, that was so simple it's barely worth
discussing. The only thing I could reason about part 2 is that it was probably like [Day 14](#day-14-puzzle-solution)
which itself was like [Day 6](#day-6-puzzle-solution). But that's it. I just couldn't visualize what needed to happen,
so I hit up [Reddit](https://www.reddit.com/r/adventofcode/comments/rl6p8y/2021_day_21_solutions/) to get my learning
on.

Even now, I was a bit stumped. A lot of the code and solutions presented had terrible readability/discoverability. Even
if it's a great solution, I'm not stepping through code with variables like `newPos` and `aScore` and, I kid you not,
there's a Java solution in there with this line

```java
dp[u][Math.min(DIRAC_DICE_WINNING_SCORE, v + newLoc + 1)][i][newLoc][1 - k] += dp[u][v][i][j][k] * DU[w];
```

???? Anyway, so I kept poking around for solutions that were not only readable but something that I *understood*. I wasn't
on the hunt for the fastest implementation, I just wanted something I could grok. Eventually, from finding a few gems, I
started to wrap my head around it. I've [discussed before](#day-15-puzzle-solution) that I have a hard time seeing DP
solutions and this seems to be an example of that. I'm pretty good at visualizing entire solutions, but doing so when
the solution space is too big and you have to extrapolate the whole from a tiny piece - yeah, my brain is not good at
that.

I also saw a lot of solutions using the same, pre-computed list of values - something roughly like this:

```json
{"3": 1, "4": 3, "5": 6, "6": 7, "7": 6, "8": 3, "9": 1}
```

Which seemed [like magic](https://en.wikipedia.org/wiki/Magic_number_(programming)) so I set out to understand that as
well.

So, the code I have in my part 2 solution is the best version I could cobble together of an approach I understand. I
realize it's not the fastest and that many solutions used memoization (which I could never quite wrap my head around???)
and, indeed, this approach is not fast, taking about 10 seconds on average to solve. Still, I actually *get it* and did
my level best to write sensible symbol names and good documentation. I do like, however, that it's fairly terse.

??? Not memoization writ-large, I get that. I just couldn't (and still can't) "see" what the memo stores and how it saves
time in regard to this puzzle.

#### Day 22 ([puzzle](https://adventofcode.com/2021/day/22), [solution](./src/solution/day22.js))

I could just *feel* it when the instruction for part 1 said "ignore the big numbers" that this was going to be another
"a literal mapping of the solution space won't work for part 2" puzzle, and I was right. Still, I didn't want to do the
heavy lifting for part 1, so I implemented a literal solution anyway, and I think it's quite tidy, even using a little
function binding to get some polymorphic behavior. 

So, what to do about part 2? Consider these reboot steps:

```
on x=2..6,y=3..8 
on x=4..9,y=1..5
```

Literally mapped, where `*` is an `on` cube and `&` is overlapping `on` cubes, it looks like this:

```
First Cuboid                Second Added                Final Result         
9 |                         9 |                         9 |                          
8 |   * * * * *             8 |   * * * * *             8 |   * * * * *              
7 |   * * * * *             7 |   * * * * *             7 |   * * * * *             
6 |   * * * * *             6 |   * * * * *             6 |   * * * * *             
5 |   * * * * *             5 |   * * & & & * * *       5 |   * * * * * * * *       
4 |   * * * * *             4 |   * * & & & * * *       4 |   * * * * * * * *       
3 |   * * * * *             3 |   * * & & & * * *       3 |   * * * * * * * *       
2 |                         2 |       * * * * * *       2 |       * * * * * *       
1 |                         1 |       * * * * * *       1 |       * * * * * *                
0 +-------------------      0 +-------------------      0 +-------------------       
  0 1 2 3 4 5 6 7 8 9         0 1 2 3 4 5 6 7 8 9         0 1 2 3 4 5 6 7 8 9        
```

To me, this is how I think most people would visualize this evolution taking shape - just intersecting and overlapping
areas and/or volumes.

But this is problematic for large data sets - keeping track of each cube individually. As was the case with
[lanternfish](#day-6-puzzle-solution), [polymers](#day-14-puzzle-solution), and [dice games](#day-21-puzzle-solution),
in order for the solution space to stay manageable, we need to treat aggregates as... well... aggregates; as single
units. Here's how I applied this concept to today's puzzle. 

Instead of modeling each cube, the idea is to just maintain a set of cuboids themselves???. At each iteration (that is,
at each reboot step), start with a blank core and add just the cuboid defined by that step (Note: if it's an `off`
instruction, no initial cuboid is added but its dimensions are still important - more on that later). After the step's
cuboid is added, then all *previously added* cuboids are processed in turn. If they intersect with the step's cuboid,
then they are split into smaller ones. Here's how that looks in 2D (note that cuboids are treated as wholes, not
compositions of cubes):

```
1a) 1st Iteration               2a) 2nd Iteration               2b) 2nd Iteration
Add first cuboid                Start blank, add 2nd cuboid     Re-add 1st cuboid, overlap found
9 |                             9 |                             9 |
8 |   +--------+                8 |                             8 |   +--------+
7 |   |        |                7 |                             7 |   |        |
6 |   |        |                6 |                             6 |   |        |
5 |   |        |                5 |       +----------+          5 |   |   +----|-----+
4 |   |        |                4 |       |          |          4 |   |   |    |     |
3 |   +--------+                3 |       |          |          3 |   +--------+     |
2 |                             2 |       |          |          2 |       |          |
1 |                             1 |       +----------+          1 |       +----------+
0 +-------------------          0 +-------------------          0 +-------------------
  0 1 2 3 4 5 6 7 8 9             0 1 2 3 4 5 6 7 8 9             0 1 2 3 4 5 6 7 8 9
        
2c) 2nd Iteration               3a) 2nd Iteration               3b) 2nd Iteration
Slice first cuboid to fit       Slice remaining first cuboid    (If the first cuboid was
around the 2nd (1st pass)       around the 2nd (2nd pass)       from an "off" step)
9 |                             9 |                             9 |
8 |   +--++----+                8 |   +--++----+                8 |   +--++----+
7 |   |  ||    |                7 |   |  ||    |                7 |   |  ||    |
6 |   |  ||    |                6 |   |  |+----+                6 |   |  |+----+
5 |   |  ||----|-----+          5 |   |  |+----+-----+          5 |   |  |
4 |   |  ||    |     |          4 |   |  ||          |          4 |   |  |
3 |   +--++----+     |          3 |   +--+|          |          3 |   +--+
2 |       |          |          2 |       |          |          2 |
1 |       +----------+          1 |       +----------+          1 |
0 +-------------------          0 +-------------------          0 +-------------------
  0 1 2 3 4 5 6 7 8 9             0 1 2 3 4 5 6 7 8 9             0 1 2 3 4 5 6 7 8 9
```

By adding the newest cuboid first, all existing cuboids are forced to fit around it, breaking themselves up into
smaller cuboids until they fit. In **fig 2c** we can see that a new cuboid of `x=2..3,y=3..8` has been created, and the
original had this subtracted from it, making it `x=4..6,y=3..8`. Finally, in **fig 3a** that remainder is split again
into a new cuboid of `x=4..6,y=6..8` with the remainder of *that* being eliminated completely. Also notice in **fig 3b**
how it works even if the step is an `off` command?

So, by the next iteration, we have more, smaller cuboids, but they are all `on` and non-overlapping. Pretty neat, eh?

I also messed around with [JSDoc's @typedef tag](https://jsdoc.app/tags-typedef.html) and my IDE (WebStorm) played along
very well - nice!

??? I checked this with my puzzle input. The answer, in terms of cubes, was over 1.2 quintillion, but the number of
cuboids at the end was only 3,390.

#### Day 23 ([puzzle](https://adventofcode.com/2021/day/23), [solution](./src/solution/day23.js))

Haven't worked on this yet, but wondering if a graph structure like below would be useful?

```
     A   B   C   D
     |   |   |   |
     A   B   C   D
     |   |   |   |
     E   E   E   E
    / \ / \ / \ / \
   H   H   H   H   H
  /                 \
 H                   H
```

#### Day 24 ([puzzle](https://adventofcode.com/2021/day/24), [solution](./src/solution/day24.js))

I'm kind of flummoxed, here, to be honest. I barely grasp [monads](https://en.wikipedia.org/wiki/Monad_(functional_programming)),
even after reading about them for an hour, and as someone who has never been a functional programmer, they're just not
in my toolbox. At all. 

Still, I figured I'd give it a go and even plucked [code from a tutorial](https://modernweb.com/a-gentle-introduction-to-monads-in-javascript/)
to get started, and I actually managed to get a really simple solution that will happily execute any ALU program you
throw at it.

But when it came to the discovery part, well, I didn't see how to do it other than crawling through the program by hand.
Perhaps this is where my understanding of the concepts involved, such as the monad laws, betray me, but I was
determined to get some insight.

After walking through the instructions in my puzzle input, a few things became immediately about the variables:

- Variable `w` is used exclusively for reading and storing input.
- Variables `x` and `y` are always reset to `0` between `inp` instructions, meaning they are truly variables and are
  used for computation per input in a very assembler-like way.
- Variable `z` is used exclusively for storing output, and is effectively the "state" of the program across inputs.

Additionally, another other pattern emerged: Each set of instructions between `inp` ones, which I will call **steps**,
distill down to one of two types:

- A straight calculation step: return the current `z * 26` plus `w` ?? a magic number
- A decision step: When `z % 26` ?? a magic number is equal to `w`, return the rounded-down remainder of `z / 26`, else
  return the above calculation

The effect of a "successful" decision was effectively a rewind. Consider the following:

```javascript
const w1 = 1;
const w2 = 8;

// Step 1
let z = 2;
z = z * 26 + w1 + 11;
// z === 68

// Step 2
if (z % 26 - 4 === w2) {
  z = Math.floor(z / 26);
  // z === 2
}
```

See how in step 2 that `z % 26 === w1 + 11`? So that as long as `w2 === w1 + 7` then the condition is satisfied, and `z`
gets set back to `2` as a result? This is what I mean by "rewind." When the rewinds aren't successful, then `z` just
keeps growing by factors of 26. Therefore, the goal of the puzzle is to find model numbers that will trip all of these
rewind steps. Question is... how do I make a monadic program do that?

![Beats Me.](https://media1.giphy.com/media/3o6UBil4zn1Tt03PI4/giphy.gif?cid=ecf05e474j9pdczrek27o3oz7jeawggljj9s26dhgtdx7ifl&rid=giphy.gif&ct=g)

*Credit: [giphy](https://giphy.com/gifs/steve-martin-3o6UBil4zn1Tt03PI4)*

Still, I had figured out the rules for each step of the program, and for mine they looked like this:

```
Step    Z after Step                        Rules From step
----------------------------------------------------------------------------
 1       z1 = w1 + 1
 2       z2 = z1 * 26 + w2 + 11
 3       z3 = z2 * 26 + w3 + 1
 4       z4 = z3 * 26 + w4 + 11
 5       z5 = z3 (when w5 === w4 + 3)       w4 === 1..6, w5 = w4 + 3
 6       z6 = z2 (when w6 === w3 - 4)       w3 === 5..9, w6 = w3 - 4
 7       z7 = z2 * 26 + w7 + 7
 8       z8 = z2 (when w8 === w7 - 6)       w8 === 1..3, w7 = w8 + 6
 9       z9 = z2 * 26 + w9 + 6
10      z10 = z2 (when w10 === w9 + 5)      w9 === 1..4, w10 = w9 + 5
11      z11 = z2 * 26 + w9 + 6
12      z12 = z2 (when w12 === w11 + 2)     w11 === 1..7, w12 = w11 + 2
13      z13 = z1 (when w13 === w2 + 7)      w2 === 1..2, w13 = w2 + 7
14      z14 = 0  (when w14 === w1 - 7)      w1 === 8..9, w14 = w1 - 7
```

Given that I know knew exactly how to solve the problem but zero clue how to turn it into a program, I just solved it
by hand, which felt a bit like doing a Sudoku puzzle. So, for the first time ever, I think, in my personal history of
doing Advent of Code, I solved both parts of a day's puzzles without using code to do it. ***Weird***

I'm still committing the program I mentioned before, but to be clear, all it does is run a program against an input
value, it does absolutely zero solving of any kind. I didn't even bother analyzing the time/space complexity since it's
kinda moot.

#### Day 25 ([puzzle](https://adventofcode.com/2021/day/25), [solution](./src/solution/day25.js))

Last day! Well, at least in puzzle order. As of this writing, I have yet to complete Day 19 and Day 23. Still, this last
day's puzzle was enjoyable. Not particularly challenging, I suppose. I did again play around with a different way of
representing objects on a grid that I think suited this puzzle. Instead of mapping the entire solution space, *or*
instead of plotting each sea cucumber in a single `Map`, I used a distinct `Set` for each herd. Obviously this would not
scale well if there were many herds, but given the parameters of the problem I like the tidiness of a) being able to
simply process the east herd, then the south, and b) keeping the solution space to just sea cucumbers and where they're
at.

From there it's a pretty on-the-nose looping algorithm with a composite return value that is used to signal when the
herds have stopped moving. Handling the **strong water currents** requirement was trivial. It did take longer to return
a result than I expected - somewhere between 5 and 6 seconds - but after I did the math, my puzzle input plotted 9,561
total sea cucumbers, and the iteration at which they stopped moving was over 500, which puts the number of steps will
into the 5+ million range, so I guess I can't complain about a loop per *??s*.

### Final Thoughts ????

TBD
