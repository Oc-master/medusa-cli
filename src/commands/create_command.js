const ora = require('ora');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const download = require('download-git-repo');

const config = require('../config');
const packageTemplate = require('../templates/package.json');
const { generatePath, runCommand, log } = require('../utils');

class CreateCommand {
  constructor(source) {
    this.projectName = source;
    this.tempPath = generatePath(__dirname, '../../__temp__');
    this.targetPath = generatePath(process.cwd(), source);
    this.spinner = ora();
    this.init();
  }

  async init() {
    this.checkFolderExists();
    await this.downloadRepository();
    this.copyFiles(this.tempPath, this.targetPath);
    await this.generatePackageJson();
    await this.initializeGit();
    await this.runApp();
  }

  /**
   * 检查目标目录是否已存在
   */
  async checkFolderExists() {
    const isExists = fs.pathExistsSync(this.targetPath);
    if (!isExists) return undefined;
    const { folderAlreadyExists, rename } = config.inquirerConfig;
    try {
      const { operation } = await inquirer.prompt(folderAlreadyExists);
      if (operation === 'rename') {
        const { projectName } = await inquirer.prompt(rename);
        if (!projectName) {
          log.warn('项目名称不能为空！');
          this.checkFolderExists();
          return undefined;
        }
        if (projectName === this.projectName) {
          log.warn('请勿使用相同的命名！');
          this.checkFolderExists();
          return undefined;
        }
        const newTargetPath = generatePath(process.cwd(), projectName);
        const isNewTargetExitst = fs.pathExistsSync(newTargetPath);
        if (isNewTargetExitst) {
          log.warn('重命名的项目已存在！');
          this.checkFolderExists();
          return undefined;
        }
        this.projectName = projectName;
        this.targetPath = generatePath(process.cwd(), projectName);
      } else if (operation === 'cover') {
        fs.removeSync(this.targetPath);
      } else {
        process.exit(0);
      }
    } catch(err) {
      log.error(err);
    }
  }

  /**
   * 下载项目模板，暂存至中间文件夹
   */
  async downloadRepository() {
    return new Promise((resolve, reject) => {
      const { platform } = config.inquirerConfig;
      const { operation } = await inquirer.prompt(platform);
      const { repositoryUrl } = config;
      this.spinner.start('正在拉取项目模版...');
      /** 删除原有的暂存项目模板目录，保证用户使用最新的项目模板 */
      fs.removeSync(this.tempPath);
      download(`${repositoryUrl}#${operation}`, this.tempPath, (error) => {
        if (error) {
          this.spinner.fail('获取项目模板失败，请重试！');
          return reject(error);
        }
        this.spinner.succeed('成功获取项目模板！');
        return resolve();
      });
    });
  }

  /**
   * 迁移文件功能
   * @param {String} sourcePath 源代码目录
   * @param {String} targetPath 目标目录
   */
  copyFiles(sourcePath, targetPath) {
    const excludeList = ['.git', 'CHANGELOG.md', 'README.md'];
    fs.copySync(sourcePath, targetPath);
    excludeList.forEach((item) => void fs.removeSync(generatePath(targetPath, item)));
  };

  /**
   * 生成package.json功能
   */
  async generatePackageJson() {
    const { projectInfo } = config.inquirerConfig;
    projectInfo[0].default = this.projectName;
    const { name, description, author, repository } = await inquirer.prompt(projectInfo);
    const data = {
      ...packageTemplate,
      name,
      author,
      description,
      repository: {
        ...packageTemplate.repository,
        url: repository
      }
    };
    const jsonPath = generatePath(this.targetPath, 'package.json');
    fs.writeJsonSync(jsonPath, data, { spaces: '\t' });
  }

  /**
   * 初始化版本管理工具
   */
  async initializeGit() {
    this.spinner.start('开始初始化Git管理工具...');
    try {
      await runCommand(`cd ${this.targetPath}`);
      process.chdir(this.targetPath);
      await runCommand('git init');
      await runCommand('git add . && git commit -m "feat(*): 初始化项目基础框架"');
      this.spinner.succeed('版本管理工具初始化完毕！');
    } catch(err) {
      this.spinner.stop();
      log.error(err);
    }
  }

  /**
   * 安装项目依赖功能
   */
  async runApp() {
    this.spinner.start('正在安装项目依赖文件，请稍等...');
    try {
      process.chdir(this.targetPath);
      await runCommand('npm install');
      this.spinner.succeed('依赖安装完成！');
      log.success('\n请运行如下命令启动项目吧：\n');
      log.success(`   cd ${this.projectName}`);
      log.success('   npm run dev');
    } catch (error) {
      this.spinner.stop();
      log.info('\n项目安装失败，请运行如下命令手动安装：\n');
      log.info(`   cd ${this.projectName}`);
      log.info('   npm install');
    }
  }
}

module.exports = CreateCommand;
