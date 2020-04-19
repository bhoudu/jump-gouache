module.exports = {
  roots: [
    "<rootDir>/src"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(//.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  modulePaths: [
    '<rootDir>/dist'
  ],
  collectCoverage: true,
  coverageDirectory: 'reports',
  coverageReporters: [
    'lcov',
  ],
  testResultsProcessor: "jest-sonar-reporter",
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        "pageTitle": "Test Report",
        "includeFailureMsg": true,
        "includeConsoleLog": true
      }
    ]
  ]
};
