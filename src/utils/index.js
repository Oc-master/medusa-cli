const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');

const generatePath = (root, targetPath) => path.resolve(root, targetPath);

const copyFiles = (tempPath, targetPath) => {
  const excludeList = ['.git', 'CHANGELOG.md', 'README.md'];
  fs.copySync(tempPath, targetPath);
  excludeList.forEach((item) => void fs.removeSync(path.resolve(targetPath, item)));
};

const runCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (error) => {
      if (error) return reject(error);
      return resolve();
    });
  });
};

exports.generatePath = generatePath;
exports.copyFiles = copyFiles;
exports.runCommand = runCommand;
