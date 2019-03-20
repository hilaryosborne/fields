const { series, rimraf, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'cross-env NODE_ENV=development nodemon --watch src --exec babel-node src',
    build: 'cross-env NODE_ENV=development npx babel src --out-dir build',
    flow: {
      script: 'npx flow',
      description: 'runs flow check',
    }
  },
};
