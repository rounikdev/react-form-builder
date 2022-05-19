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
    '!src/ui/**/*.*'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  coverageReporters: ['clover', 'cobertura', 'json', 'json-summary', 'lcov', 'text'],
  globalSetup: './jest-global-setup.js',
  reporters: ['default'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@managers(.*)$': '<rootDir>/src/managers$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@providers(.*)$': '<rootDir>/src/providers$1',
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
