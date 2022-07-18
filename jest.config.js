module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/stories/**/*',
    '!src/**stories-components/**/*.*',
    '!src/**/*.stories.tsx',
    '!src/**/stories/**/*.*',
    '!src/**/*.cy.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/index.ts',
    '!src/**/*.d.ts',
    '!src/services/utils/**/*.*',
    '!src/ui/**/*.*',
    '!src/styles/**/*.*'
  ],
  coverageReporters: ['clover', 'cobertura', 'json', 'json-summary', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 85,
      lines: 95,
      statements: 95
    }
  },
  globalSetup: './jest-global-setup.js',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@core(.*)$': '<rootDir>/src/core$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@styles(.*)$': '<rootDir>/src/styles$1',
    '^@types(.*)$': '<rootDir>/src/types$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1'
  },
  reporters: ['default'],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['instrumented'],
  testRegex: 'tests/.*.test.(ts|tsx)$',
  testTimeout: 20000
};
