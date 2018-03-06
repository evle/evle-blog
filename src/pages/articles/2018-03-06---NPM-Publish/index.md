---
title: "How to publish your package on NPM/YARN"
date: "2018-03-06"
layout: post
draft: false
path: "/posts/publish-to-npm"
category: ""
tags:
  - npm
  - yarn
description: ""
---
目前[npm](https://www.npmjs.com/)和[yarn](https://yarnpkg.com)是最流行的JavaScript包管理工具, 它们都是使用同一个**npm clients**. 本文将介绍如何将自己的包发布到npm和yarn.

## 发布程序以命令行形式使用
发布命令行工具之后可以通过`npm install pkg-name -g`安装, 即可在**terminal**使用.
1. 创建项目
```bash
$ mkdir my-app && cd my-app
$ npm init -y
```
2. 编写命令行工具, 在`index.js`
```JavaScript
#!/usr/bin/env node  
// logic
```

3. 指定启动文件，在`package.json`
```JavaScript
"bin": {
  "my-app": "./index.js"
}

4. 发布
```bash
$ npm login
$ npm publish
```
在发布时如果包名已经存在会得到以下出错信息,需要改包名再发布  
*npm ERR! You do not have permission to publish "npm-pkg-demo".*
当程序修改之后再重新发布时, 需要运行以下命令修改版本号后再发布.
`$ npm version patch`
5. 下载并使用
```bash
$ npm i my-app -g
$ my-app arguments
```

## 发布程序以库的形式使用
1. 创建项目参上, 再创建一个`lib`目录
2. 编写库, 在`lib/main.js`
```javascript
const myLib = {
  foo: function(){
    // statement
  }
}
module.exports = myLib;
3. 导出库, 在`index.js`
```JavaScript
var myLib = require('./lib/main');
module.exports = myLib;
```
4. 发布，参照之前的发布步骤

## 发布包到yarn
发布包到yarn的步骤和发布到npm相同, 除了最后的发布命令. 先通过`yarn login`登陆npm, 然后使用`yarn publish`. 发布之后即可下载`yarn add my-app`或者查看`yarn info my-app`.
