// import type { JestConfigWithTsJest } from 'ts-jest';
// import { defaults as tsjPreset } from 'ts-jest/presets';

// const config: JestConfigWithTsJest = {
//   ...tsjPreset,
//   testEnvironment: 'node',
//   moduleNameMapper: {
//     '^(\\.{1,2}/.*)\\.js$': '$1'
//   },
//   transform: {
//     '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
//   },
//   testMatch: [
//     "**/tests/**/*.test.ts"  // Only run backend tests
//   ],
//   modulePathIgnorePatterns: [
//     "<rootDir>/client/"      // Ignore client directory
//   ]
// };

// export default config; 

export default {
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      diagnostics: { ignoreCodes: [1343] }
    }],
    '^.+\\.jsx?$': 'babel-jest',
    '\\.css$': '<rootDir>/node_modules/jest-css-modules-transform'
  },
  testEnvironment: 'node',
  testMatch: [
    "**/tests/**/*.test.ts",    // Matches bibleVerse.test.ts
    "**/tests/**/*.tests.ts"    // Matches server.tests.ts
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  modulePathIgnorePatterns: [
    "<rootDir>/client/"
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: [
    'backEnd/**/*.{ts,js}',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};