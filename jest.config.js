/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  // Charge .env dans process.env pour les tests d'intégration (skippés en CI faute de .env).
  setupFiles: ['<rootDir>/jest.setup.ts'],
};
