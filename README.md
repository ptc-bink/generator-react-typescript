# generator-react-typescript
A generator for creating React Typescript projects

## Getting started

- Install: `npm install -g generator-react-typescript`
- Run: `yo react-typescript`

## Commands

* `yo react-typescript` initialize generator environment
* `yo react-typescript:init` generate a new React Typescript project
* `yo react-typescript:webpack` generate a Webpack config file
* `yo react-typescript:component <name>` generates a React component with the name `<name>`
* `yo react-typescript:container <name>` generates a React data container with the name `<name>`
* `yo react-typescript:sync` syncronize all automatically generated files (components and containers index files) with filesystem structure and project configuration

### Experimental commands 
* `yo react-typescript:theme <name>` generates a React components theme with the name `<name>`
* `yo react-typescript:layout <name>` generates a React containers layout with the name `<name>` 

## What do you get?
Scaffolds out a complete React Typescript project structure for you:
```
.
├── src/
│   ├── components/
│   │   └── index.ts
│   ├── containers/
│   │   └── index.ts
│   └── app.tsx
├── .yo-rc.json
├── package.json
├── typings.json
└── tsconfig.json
```
