---
title: "Webpack4: from 0 Conf to Production Mode"
date: "2018-03-19"
layout: post
draft: false
path: "/posts/WebPack-Get-Started"
category: "Webpack"
tags:
  - "Webpack"
description: ""
---
![9ofbvT.png](https://s1.ax1x.com/2018/03/19/9ofbvT.png)
Webpack是比Gulp更火的前端自动化构建工具, Webpack4相比之前的版本有不少性能的提升，并且配置也简化了不少. 对于一个简单的项目Webpack 4 不需要 `webpack.config.js`配置文件, 它的默认entry是`./src`, 让我们试试.
```bash
$ npm i webpack --save-dev
$ npm i webpack-cli --save-dev
```
在`package.json`中添加启动脚本
```JavaScript
"scripts":{
    "build": "webpack"
}
```
新建`./src/index.js`并输入
```JavaScript
console.log('Stuff here');
```
然后运行`npm run build`, 会发现bundle会输出到`./dist/main.js`. 可以通过给scripts添加参
数覆盖默认的entry:
```JavaScript
"build": "webpack ./app/src/js/index.js --output ./public/main.js"
```

## Prod & Dev Mode
通常一个项目都有2个配置文件, 一个是针对prod模式的, 另一个针对dev模式的. 如果没设置的话在执行`webpack`命令后会得到以下warnning
  > WARNING in configuration
  The 'mode' option has not been set. Set 'mode' option to ? 'development' or 'production' to enable defaults for this environment.   

所以我们需要在`package.json`的`scripts`里指定两种模式
```JavaScript
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

## Bundle JS的简单示例
下面是一个最简单的打包JS文件的例子, `entry`指定要打包的文件, `output`指定文件的输出位置.
```JavaScript
module.exports = {
  entry:  __dirname + "/app/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}
```
配置好`webpack.config.js`之后可以通过在`package.json`中添加`scripts`运行WebPack
```JavaScript
...
"scripts":{
  "build": "webpack"
},
...
```
## the Webpack dev server
```bash
$ npm install --save-dev webpack-dev-server
```
安装`webpack-dev-server`之后，在`package.json`中添加
```JavaScript
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```

## 使用babel-loader
```bash
npm i babel-core babel-loader babel-preset-env --save-dev
```
安装好babel后，在`webpack.config.js`中配置`babel-loader`
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```
也可以不通过配置文件来使用`babel-loader`, 在`scripts`中添加`--module-bind js=babel-loader`
```javascript
"scripts": {
    "dev": "webpack --mode development --module-bind js=babel-loader",
    "build": "webpack --mode production --module-bind js=babel-loader"
  }
```

## 添加React支持
```bash
$ npm i react react-dom --save-dev
$ npm i babel-preset-react --save-dev
```
安装好后新建`.babelrc`并配置babel
```JavaScript
{
  "presets": ["env", "react"]
}
```

## 压缩JS代码
```bash
npm i -D uglifyjs-webpack-plugin
```
```JavaScript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  plugins: [
    new UglifyJsPlugin()
  ]
}
```
## CSS预处理
```bash
npm i -D css-loader style-loader
```
### SCSS
```bash
npm i -D  sass-loader node-sass
```
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
};
```
### PostCSS
```bash
npm i -D postcss-loader postcss-cssnext
```
```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ]
  },
};
```
