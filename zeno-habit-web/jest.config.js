/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json"
    }
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: [
    "html",
    "text",
    "json",
    "lcov",
    "text-summary",
    "cobertura",
    "clover"
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.ts'
  ],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/serviceWorker.ts",
    "!src/reportWebVitals.ts"
  ],
  "coveragePathIgnorePatterns": [
    "./src/*/*.types.{ts,tsx}",
    "./src/index.tsx",
    "./src/serviceWorker.ts"
  ],
  "coverageThreshold": {
    "global": {
      "statements": 95,
      "branches": 95,
      "lines": 95,
      "functions": 95
    }
  },
  "transform": {
    "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest"
  },
  "transformIgnorePatterns": [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$"
  ],
  "moduleNameMapper": {
    "^react-native$": "react-native-web",
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "src/(.*)$": "<rootDir>/src/$1"
  }
};