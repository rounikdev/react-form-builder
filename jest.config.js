module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/stories/**/*',
    '!src/**stories-components/**/*.*',
    '!src/**/*.stories.tsx',
    '!src/**/stories/**/*.*',
    '!src/**/*.test.{ts,tsx}',
    '!src/index.ts',
    '!src/**/*.d.ts',
    '!src/services/utils/**/*.*'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  globalSetup: './jest-global-setup.js',
  reporters: ['default'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@managers(.*)$': '<rootDir>/src/managers$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@providers(.*)$': '<rootDir>/src/providers$1',
    '^@root(.*)$': '<rootDir>/src$1',
    '^@services(.*)$': '<rootDir>/src/services$1'
  },
  setupFilesAfterEnv: ['<rootDir>/enzyme-setup.js', '<rootDir>/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [],
  testRegex: 'tests/.*.test.(ts|tsx)$',
  testTimeout: 20000
};
