# medusa-cli

微信/百度小程序项目基础框架初始化工具，快速搭建小程序模板工具。

## Installation

```shell
$ git clone git@gitlab.chebaba.com:frontend/medusa-cli.git
$ cd medusa-cli
$ npm link
```

`npm link` 可以将 `medusa-cli` 安装在全局环境中，应用这一机制我们就可以正常的使用该工具提供的命令。在运行 `npm link` 命令之前请确保你未更改过镜像源地址，查看镜像源方式如下：

```shell
$ npm config get registry
```

镜像源地址为 https://registry.npmjs.org/ 时可以正常运行 `npm link` 命令，如果不是请运行以下命令：

```shell
$ npm config set registry https://registry.npmjs.org
```

## Usage

本工具提供初始化基础框架的能力，创建项目的同时会初始化版本管理工具和下载相关依赖，你可以在任何目录当中使用以下命令体验本工具：

```shell
$ medusa create <project-name>
```
