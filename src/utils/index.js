const chalk = require('chalk');
const path = require('path');
const childProcess = require('child_process');

const generatePath = (root, targetPath) => path.resolve(root, targetPath);

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (error) => {
      if (error) return reject(error);
      return resolve();
    });
  });
};

const log = {
  info(msg = '') {
    console.log(chalk.blue(`${msg}`));
  },
  success(msg = '') {
    console.log(chalk.green(`${msg}`));
  },
  warn(msg = '') {
    console.log(chalk.yellow(`\nWarn: ${msg}\n`));
  },
  error(msg = '') {
    console.log(chalk.red(`\nFail: ${msg}\n`));
  },
};

module.exports = {
  generatePath,
  runCommand,
  log,
};
