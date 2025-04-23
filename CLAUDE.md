# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Most Critical Instructions
- Never try to run the web server. I'm already running it. If you want to test your changes just ask me of it works.
- Please only use pure JavaScript, plus React, plus Tailwind, plus Vite. Don't introduce any other frameworks or languages or complexity unless you specifically ask. We want to keep the tech stack simple.
- Please use best practices for all of these frameworks and languages. For instance when doing CSS stuff, do it the way that corresponds to best practices for Tailwind. Same for React, Vite, and JavaScript.

## Code Style Guidelines
- Formatting: Use consistent indentation (2 spaces) and line endings
- Naming: Use camelCase for variables/functions, PascalCase for classes
- Imports: Group imports with standard library first, then third-party, then local
- Types: Use strong typing where applicable
- Error handling: Use try/catch blocks with informative error messages
- Comments: Document complex logic and public interfaces
