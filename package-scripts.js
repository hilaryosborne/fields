const { series, rimraf, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'npx nps build',
    pipeline: {
      description: 'Executes a simulated build pipeline locally',
      script: series(
        `npx nps clean`,
        `npx nps codestandards`,
        `npx nps codestandardsreportcheckstyle`,
        `npx nps flow`,
        `npx nps flowcoverage`,
        `npx nps test`,
        `npx nps build`,
      ),
    },
    clean: {
      description: 'Deletes the various generated folders',
      script: series(rimraf('./lib'), rimraf('./flow-coverage'), rimraf('./codestandards')),
    },
    flow: {
      script: 'npx flow check',
      description: 'runs flow check',
    },
    flowcoverage: {
      script: 'npx flow-coverage-report --config=.flowcoverage',
      description: 'runs flow coverage check',
    },
    codestandards: {
      script: 'npx eslint ./src',
      description: 'runs code standards jobs',
    },
    codestandardsreport: {
      script: 'npx eslint ./src --format=html --output-file=./codestandards/eslint.html',
      description: 'runs code standards jobs and generates a report',
    },
    codestandardsreportcheckstyle: {
      script: 'npx eslint ./src --format=checkstyle --output-file=./codestandards/eslint-checkstyle.xml',
      description: 'runs code standards jobs and generates a checkstyle report',
    },
    test: {
      script: 'cross-env NODE_ENV=test ENV_ID=local jest',
      description: 'Runs unit tests for both server and client apps',
    },
    build: 'cross-env NODE_ENV=development npx babel src --out-dir lib',
    deploy: {
      description: 'Creates a deploy environment',
      default: series('npx nps clean', 'npx nps build'),
    }
  },
};
