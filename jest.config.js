module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/__test__/setupJest.js'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
    moduleNameMapper: {
      '\\.css': '<rootDir>/__test__/__mocks__/styleMock.js',
  }
}