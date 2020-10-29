const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
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

const getAppConfig = () => {
  try {
    const choose = [];
    const root = process.cwd();
    const appJsonPath = path.resolve(root, 'src/app.json');
    const content = JSON.parse(fs.readFileSync(appJsonPath, { encoding: 'utf-8' }));
    const { pages = [], subpackages = [] } = content;
    const { length: pagesLength } = pages;
    if (pagesLength) {
      choose.push({ name: '主包', value: './' });
    }
    const { length: subpackagesLength } = subpackages;
    if (!subpackagesLength) return choose;
    const temp = subpackages.map((subpackage) => {
      const { root } = subpackage;
      return { name: `分包：${root}`, value: `./${root}` };
    });
    return choose.concat(temp);
  } catch (error) {
    return [];
  }
}

module.exports = {
  generatePath,
  runCommand,
  log,
  getAppConfig,
};
