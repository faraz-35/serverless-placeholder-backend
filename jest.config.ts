export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '/opt/nodejs/(.*)': '<rootDir>/layers/aws/nodejs/$1',
    },
    modulePaths: ['<rootDir>'],
    setupFiles: ['./jest.setup.ts'],
};
