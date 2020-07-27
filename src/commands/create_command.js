const ora = require('ora');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const download = require('download-git-repo');

const config = require('../config');
const packageTemplate = require('../templates/package.json');
const { generatePath, copyFiles, runCommand } = require('../utils');

class CreateCommand {
  constructor(source, destination) {
    this.folderName = source;
    this.targetPath = generatePath(process.cwd(), source);
    this.spinner = ora();
    this.init();
  }

  async init() {
    try {
      await this.checkFolderExists();
      await this.downloadRepository();
      this.buildProject();
    } catch(error) {
      console.log('error: ', error);
    }
  }

  /**
   * 检查目标目录是否存在
   */
  checkFolderExists() {
    return new Promise(async (resolve, reject) => {
      const isExists = fs.pathExistsSync(this.targetPath);
      if (!isExists) return resolve();
      const { folderExist, rename } = config.INQUIRER_CONFIG;
      const { operation } = await inquirer.prompt(folderExist);
      if (operation === 'newFolder') {
        const { folderName } = await inquirer.prompt(rename);
        if (folderName === this.folderName) {
          return reject('请勿使用相同的名称！');
        } else if (fs.pathExistsSync(generatePath(process.cwd(), folderName))) {
          return reject('该名称文件夹已存在！');
        } else {
          return resolve();
        }
      } else if (operation === 'cover') {
        fs.removeSync(this.targetPath);
        return resolve();
      } else {
        process.exit();
      }
    });
  }

  /**
   * 下载项目模板，暂存至中间文件夹
   */
  downloadRepository() {
    return new Promise((resolve, reject) => {
      const { REPOSITORY, DESTINATION } = config;
      this.spinner.start('正在拉取项目模版...');
      /** 删除原有目标目录，保证用户使用最新的项目模板 */
      fs.removeSync(DESTINATION);
      download(REPOSITORY, DESTINATION, (error) => {
        if (error) {
          this.spinner.fail('获取项目模板失败，请重试！');
          return reject(error);
        }
        this.spinner.succeed('成功获取项目模板！');
        return resolve();
      });
    });
  }

  async buildProject() {
    const { DESTINATION, INQUIRER_CONFIG: { projectInfo } } = config;
    copyFiles(DESTINATION, this.targetPath);
    const { description, author, repository } = await inquirer.prompt(projectInfo);
    const jsonPath = generatePath(this.targetPath, 'package.json');
    const content = {
      ...packageTemplate,
      description,
      author,
      repository: {
        ...packageTemplate.repository,
        url: repository,
      },
      name: this.folderName,
    };
    fs.writeJsonSync(jsonPath, content, { spaces: '\t' });
    this.spinner.start('开始初始化Git管理工具...')
    await runCommand(`cd ${this.targetPath}`);
    try {
      process.chdir(this.targetPath);
    } catch (err) {
      console.error(`chdir: ${err}`);
    }
    await runCommand('git init');
    this.spinner.succeed('版本管理工具初始化完毕！');
    this.runApp();
  }

  async runApp() {
    try {
      this.spinner.start('正在安装项目依赖文件，请稍等...');
      await runCommand('npm install');
      await runCommand('git add . && git commit -m "feat(*): 初始化项目基本框架"');
      this.spinner.succeed('依赖安装完成！');

      console.log('请运行如下命令启动项目吧：\n');
      console.log(`   cd ${this.folderName}`);
      console.log('   npm run dev');
    } catch (error) {
      console.log(error);
      this.spinner.stop();
      console.log('\n项目安装失败，请运行如下命令手动安装：\n');
      console.log(`   cd ${this.folderName}`);
      console.log('   npm install');
    }
  }
}

module.exports = CreateCommand;
