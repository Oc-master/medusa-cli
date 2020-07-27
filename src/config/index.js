const { generatePath } = require('../utils');

module.exports = {
  REPOSITORY: 'github:Oc-master/miniprogram-base',
  DESTINATION: generatePath(__dirname, '../../__temp__'),
  INQUIRER_CONFIG: {
    folderExist: [{
      type: 'list',
      name: 'operation',
      message: '当前文件夹已存在,请选择以下一项操作: ',
      choices: [
        { name: '重命名文件夹', value: 'newFolder' },
        { name: '强制覆盖', value: 'cover' },
        { name: '退出', value: 'exit' },
      ],
    }],
    rename: [{
      name: 'folderName',
      type: 'input',
      message: '请输入新的项目名称: ',
    }],
    projectInfo: [
      {
        name: 'description',
        type: 'input',
        message: '请输入项目描述: ',
      },
      {
        name: 'author',
        type: 'input',
        message: '请输入作者名称: ',
      },
      {
        name: 'repository',
        type: 'input',
        message: '请输入仓库地址: ',
      },
    ],
  },
};
