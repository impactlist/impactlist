# Impact List

Impact List is a project that aims to build and maintain a list which ranks the top ~1,000 living people by their positive impact on the world via donations.

The goal is to make the list popular enough to increase the status awarded to those who rank highly, bring more awareness to the importance of donation effectiveness, and ultimately cause people to donate more effectively and/or donate more money to effective causes.

See [this description of the project](https://forum.effectivealtruism.org/posts/LCJa4AAi7YBcyro2H/proposal-impact-list-like-the-forbes-list-except-for-impact) for details.

## How you can help

We’re actively seeking volunteers to help with the project. 

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute research to the site. This includes keeping the donations up to date and accurate for existing people, adding more people (and all their donations), and helping to improve our research into the effectiveness of various charities or general types of charity. 

We also are looking for volunteer developers and UX people to help improve the functionality and appearance of the website. 

Join [the discord](https://discord.gg/6GNre8U2ta) to learn more about these and other ways that you can get involved.

## Tech Stack

- React
- Tailwind CSS
- Vite
- Vitest

## How to run the site locally so you can make changes

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Generate data
   ```
   npm run generate-data
   ```
4. Start development server:
   ```
   npm run dev
   ```
5. Build for production:
   ```
   npm run build
   ```
6. Preview production build:
   ```
   npm run preview
   ```

## Linting

1. The entire project

```
npm run lint
```

2. On single file

```
npx eslint <filename>
```

### Prettier

Check:

```
npx prettier --check .
```

Write:

```
npx prettier --write .
```

## Testing

Test Scripts Available:

- npm run test - Run tests in watch mode
- npm run test:run - Run once and exit
- npm run test:coverage - Generate coverage report
- npm run test:watch - Explicit watch mode
