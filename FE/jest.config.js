/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    // Use the ts-jest preset for handling TypeScript files
    preset: 'ts-jest',
    // Use 'node' as the test environment
    testEnvironment: 'node',
    // Specify which files Jest should look for as test files
    testMatch: [
      "**/__tests__/**/*.ts?(x)",
      "**/?(*.)+(spec|test).ts?(x)"
    ],
    // Ignore the node_modules directory
    testPathIgnorePatterns: [
      "/node_modules/"
    ],
    // Mappers to transform files before running tests
    transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            // 💡 This is the key change
            tsconfig: {
              jsx: 'react-jsx',
            },
          },
        ],
      },
    // Module file extensions to support
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  
  // Use ES module export syntax to resolve the "module is not defined" error
  export default config;