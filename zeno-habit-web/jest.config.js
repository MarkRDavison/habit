/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.js'
  ],
};