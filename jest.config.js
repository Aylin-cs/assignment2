/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
  
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
