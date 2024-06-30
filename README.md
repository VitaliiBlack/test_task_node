# Commission Calculator

This project calculates commission fees for cash in and cash out operations based on provided configurations.

## Table of Contents

- [Commission Calculator](#commission-calculator)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)

## Installation

To install the project dependencies, run:

```bash
yarn install
```

## Usage

To run the application, use:

```bash
yarn start
```

This will execute the application with the default input file `./input.json`. You can specify a different input file by modifying the script in `package.json`.

## Scripts

The following scripts are available:

- `start`: Runs the application with the default input file.
- `lint`: Runs ESLint to check for linting errors.
- `lint:fix`: Runs ESLint and automatically fixes linting errors.
- `format`: Formats the code using Prettier.
- `test`: Runs the test suite using Jest.

## Project Structure

```plaintext
project-root/
├── src/
│   ├── configs/
│   │   ├── cashInConfig.js
│   │   ├── cashOutNaturalConfig.js
│   │   └── cashOutJuridicalConfig.js
│   ├── services/
│   │   └── transactionService.js
│   ├── types/
│   │   └── index.js
│   ├── utils/
│   │   └── index.js
│   └── app.js
├── tests/
│   └── transactionService.test.js
├── input.json
├── package.json
└── README.md
```
