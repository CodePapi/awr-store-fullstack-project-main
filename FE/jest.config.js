/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      "**/__tests__/**/*.ts?(x)",
      "**/?(*.)+(spec|test).ts?(x)"
    ],
    testPathIgnorePatterns: [
      "/node_modules/"
    ],
    transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: {
              jsx: 'react-jsx',
            },
          },
        ],
      },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
  
  export default config;