module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/stories/**/*',
    '!src/**stories-components/**/*.*',
    '!src/**/*.stories.tsx',
    '!src/**/stories/**/*.*',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/index.ts',
    '!src/**/*.d.ts',
    '!src/services/utils/**/*.*',
    '!src/ui/**/*.*',
    '!src/styles/**/*.*'
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 85,
      lines: 95,
      statements: 95
    }
  },
  coverageReporters: ['clover', 'cobertura', 'json', 'json-summary', 'lcov', 'text'],
  globalSetup: './jest-global-setup.js',
  reporters: ['default'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@core(.*)$': '<rootDir>/src/core$1',
    '^@root(.*)$': '<rootDir>/src$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['instrumented'],
  testRegex: 'tests/.*.test.(ts|tsx)$',
  testTimeout: 20000
};
