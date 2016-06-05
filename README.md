# generator-react-typescript
A generator for creating React Typescript projects

## Getting started

- Install: `npm install -g generator-react-typescript`
- Run: `yo react-typescript`

## Commands

* `yo react-typescript` generate a new React Typescript project
* `yo react-typescript:component <name>` generates a React component with the name `<name>`
* `yo react-typescript:container <name>` generates a React data container with the name `<name>`

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
