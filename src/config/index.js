module.exports = {
  repositoryUrl: 'github:Oc-master/miniprogram-base',
  inquirerConfig: {
    folderAlreadyExists: [{
      name: 'operation',
      type: 'list',
      message: '项目已存在，请您从以下选择当中选择一项操作：',
      choices: [
        { name: '重命名文件夹', value: 'rename' },
        { name: '强制覆盖', value: 'cover' },
        { name: '退出', value: 'exit' },
      ],
    }],
    rename: [{
      name: 'projectName',
      type: 'input',
      message: '请您输入新的项目名称：',
    }],
    platform: [{
      name: 'operation',
      type: 'list',
      message: '请选择当前项目将应用于哪一个平台：',
      choices: [
        { name: '微信小程序', value: 'wx' },
        { name: '百度智能小程序', value: 'swan' },
      ],
    }],
    projectInfo: [{
      name: 'name',
      default: '',
      type: 'input',
      message: '请输入项目名称：',
    }, {
      name: 'description',
      type: 'input',
      message: '请输入项目描述: ',
    }, {
      name: 'author',
      type: 'input',
      message: '请输入作者名称: ',
    }, {
      name: 'repository',
      type: 'input',
      message: '请输入仓库地址: ',
    }],
    typeChoose: [{
      name: 'type',
      type: 'list',
      message: '请选择当前要添加的文件类型（Page or Component）：',
      choices: [
        { name: 'Page', value: 'pages' },
        { name: 'Component', value: 'components' },
      ],
    }],
  },
};
