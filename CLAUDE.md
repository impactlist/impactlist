# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Most Critical Instructions

- Avoid code duplication when you have an opportunity to modularize or reuse code (the DRY principle). When making changes, look for and flag opportunities to simplify code (without compromising functionality.)
- Make the code as simple and maintainable as possible while maintaining correctness and functionality. Don't make short term fixes that layer on extra complexity just to get things working in the short term.
- Don't remove functionality just because it's easier.
- Take pride in your code quality. Only write code that you would be happy to defend in front of a big meeting of senior developers.
- You can use git to find info about previous or current changes, but don't do things like 'git add' or 'git commit' which change the git state.
- Please use best practices for all of these frameworks and languages. For instance when doing CSS stuff, do it the way that corresponds to best practices for Tailwind. Same for React, Vite, and JavaScript.
- Never try to run the site yourself. I'll do that.

## Normal instructions

- Don't make assumptions about which values are acceptable unless you check with me. For instance don't constrain inputs to only positive numbers unless you're very sure I don't want negative numbers.
- It's important to realize that some recipients can have negative cost per life, which means that money donated to those recipients causes people to die. This is all part of the framework.

## Code Style Guidelines

- Error handling: Never fail silently when something unexpected happens. We always want to fail hard and loudly to not let subtle bugs persist.
- Comments: Document complex logic and public interfaces
- Please only use pure JavaScript (ES6), plus React, plus Tailwind, plus Vite.
