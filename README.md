# Advent of Code 2021

## What I've Learned

This branch is to capture stuff I learned along the way and re-visit less-than-optimal solutions without mucking about
with my original work, which you can still view on the **main** branch.

### Puzzles

Following are the days' solutions which I have updated based on after-the-fact learnings, either from personal insight,
discussing the puzzles with friends, or from our pal, Internet.

#### Day 10 ([puzzle](https://adventofcode.com/2021/day/10), [solution](./src/solution/day10.js))

I mentioned in my original notes that I realized later that this was solvable iteratively without the need for
recursion. This update is based on that realization and the resulting solution not only has better time complexity, but
is also a lot less code.

> 💡**Key Takeaway** Gut instincts aren't like what they show on TV when a seasoned cop just *knows* somebody is suspect. I saw a recursive
> solution from the start and never re-considered it.
