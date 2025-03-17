module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['whatwg-fetch'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-bootstrap/(.*)$': '<rootDir>/node_modules/react-bootstrap/cjs/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-bootstrap|@react-bootstrap|classnames)/)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    "<rootDir>/src/**/*.test.tsx",
    "<rootDir>/src/**/*.test.ts"
  ]
} 