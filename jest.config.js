module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {},
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/setupJest.js'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}