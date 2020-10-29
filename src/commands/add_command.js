const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const config = require('../config');
const { getAppConfig, log } = require('../utils');
const { pageWxml, pageStyle, pageJavascript, pageJson } = require('../templates/page');
const { componentWxml, componentStyle, componentJavascript, componentJson } = require('../templates/component');

const mkdir = (directory, cb) => {
  const hasFile = fs.existsSync(directory);
  if (hasFile) {
    cb();
  } else {
    mkdir(path.dirname(directory), function () {
      fs.mkdirSync(directory);
      cb();
    });
  }
}

const dotExistDirectoryCreate = (path) => {
  return new Promise((resolve) => mkdir(path, () => resolve()));
}

const writeTemplate = (path, template) => {
  const hasFile = fs.existsSync(path);
  if (hasFile) {
    log.error('该文件已存在，无法写入相应模板！');
    return undefined;
  }
  return new Promise((resolve, reject) => {
    /** fs.writeFile将模板写入相应路径文件当中 */
    fs.writeFile(path, template, 'utf8', (error) => {
      if (!error) {
        resolve();
      } else {
        /** 模板写入失败操作 */
        log.error('写入模板失败！');
        reject();
      }
    });
  });
};

module.exports = async (source) => {
  const { typeChoose } = config.inquirerConfig;
  const { type } = await inquirer.prompt(typeChoose);
  const choices = getAppConfig();
  const { dir } = await inquirer.prompt([{
    choices,
    name: 'dir',
    type: 'list',
    message: '请选择该文件夹添加位置：',
  }])
  const dirPath = path.resolve(process.cwd(), 'src', dir, type, source);
  const isExist = fs.existsSync(dirPath);
  if (isExist) {
    log.error('该文件目录已存在！');
    return undefined;
  } else {
    await dotExistDirectoryCreate(dirPath);
  }
  if (type === 'pages') {
    await writeTemplate(path.resolve(dirPath, `index.wxml`), pageWxml(source));
    await writeTemplate(path.resolve(dirPath, `index.less`), pageStyle(source));
    await writeTemplate(path.resolve(dirPath, `index.js`), pageJavascript);
    await writeTemplate(path.resolve(dirPath, `index.json`), pageJson);
  } else {
    await writeTemplate(path.resolve(dirPath, `index.wxml`), componentWxml(source));
    await writeTemplate(path.resolve(dirPath, `index.less`), componentStyle(source));
    await writeTemplate(path.resolve(dirPath, `index.js`), componentJavascript);
    await writeTemplate(path.resolve(dirPath, `index.json`), componentJson);
  }
};
