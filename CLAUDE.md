# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Most Critical Instructions

- Make the code as simple and maintainable as possible. Don't make short term fixes that layer on extra complexity just to get things working in the short term.
- Take pride in your code quality. Only write code that you would be happy to defend in front of a big meeting of senior developers.
- Make sure your changes confirm to the configuration in .prettierrc.
- Never try to run the web server. I'm already running it. If you want to test your changes just ask me of it works.
- Never try to run any git commands unless I explicitly ask you to. I'll handle all git stuff.
- Please only use pure JavaScript, plus React, plus Tailwind, plus Vite. Don't introduce any other frameworks or languages or complexity unless you specifically ask. We want to keep the tech stack simple.
- Please use best practices for all of these frameworks and languages. For instance when doing CSS stuff, do it the way that corresponds to best practices for Tailwind. Same for React, Vite, and JavaScript.

## Code Style Guidelines

- Formatting: Use consistent indentation (2 spaces) and line endings
- Naming: Use camelCase for variables/functions, PascalCase for classes
- Imports: Group imports with standard library first, then third-party, then local
- Types: Use strong typing where applicable
- Error handling: Use try/catch blocks with informative error messages
- Comments: Document complex logic and public interfaces
