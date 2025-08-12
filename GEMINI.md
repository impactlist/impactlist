# Gemini.md

This file provides guidance to Gemini CLU when working with code in this repository.

If you are Claude Code, ignore this file -- it's for another coding agent.

## Most Critical Instructions

- Make the code as simple and maintainable as possible while maintaining correctness and functionality. Don't make short term fixes that layer on extra complexity just to get things working in the short term.
- Don't remove functionality just because it's easier.
- Take pride in your code quality. Only write code that you would be happy to defend in front of a big meeting of senior developers.
- Never try to run any git commands unless I explicitly ask you to. I'll handle all git stuff.
- Please only use pure JavaScript (ES6), plus React, plus Tailwind, plus Vite. Don't introduce any other frameworks or languages or complexity unless you specifically ask. We want to keep the tech stack simple.
- Please use best practices for all of these frameworks and languages. For instance when doing CSS stuff, do it the way that corresponds to best practices for Tailwind. Same for React, Vite, and JavaScript.
- Never try to run the site or check its output yourself. I'll do that
- Don't try to test things unless I specifically ask you to. Although you can run existing tests and 'npm run lint'

## Code Style Guidelines
- Naming: Use camelCase for variables/functions, PascalCase for classes
- Error handling: Never fail silently when something unexpected happens. We always want to fail hard and loudly to not let subtle bugs persist.
- Comments: Document complex logic and public interfaces