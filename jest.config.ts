import type { Config } from 'jest';

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest/presets/default-esm", // Ativa suporte nativo a ES Modules
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.(spec|test).ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [151002] // Silencia aquele warning de hybrid modules se aparecer
        }
      }
    ]
  }
};

export default config;