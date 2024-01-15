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
        '/opt/nodejs/(.*)': '<rootDir>/sam-aws-layer/aws/nodejs/$1',
    },
    modulePaths: ['<rootDir>'],
    setupFiles: ['./jest.setup.ts'],
};
