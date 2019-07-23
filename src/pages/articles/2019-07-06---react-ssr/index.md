---
title: 'React服务端渲染 从一个例子开始'
date: '2019-07-06'
layout: post
draft: false
path: '/posts/react-ssr'
category: ''
tags:
  -
description: ''
---

## Why SSR？

React 编写的程序是客户端渲染的程序 CSR
前端 Ajax --- jSON 后端
前端页面渲染 数据
开发效率提升 前后端分离

速度
CSR 浏览器下载 HTML -》 浏览器下载 JS -》 浏览器运行 React 代码 -》 页面渲染
SSR -》 HTML

SEO
搜的到

缺点
服务器性能

## 在服务器端编写 React 组件

express

res.send('html')

yarn add webacpk webpack-cli
yarn add @babel/core --dev
yarn add babel-loader babel-preset-react babel-preset-stage-0
webpack.server.js

new
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
.babelrc
{
"presets": ["@babel/preset-env", "@babel/preset-react"]
}

const path = require('path')
const nodeExternals = require('webpack-node-externals');
module.exports = {
target: 'node', // webpack 可以为 js 的各种不同的宿主环境提供编译功能，为了能正确的进行编译，就需要开发人员在配置里面正确的进行配置。electron web 默认

entry: './src/index.js'
output:{
filename: 'bundle.js',
path: path.resolve(\_\_diranme, 'build)
},
mode: 'development',
externals: [nodeExternals()]
module:{
rules:[{
test:/\.js?\,
loader: 'babel-loader',
exclude: path.resolve(\_\_dirname, 'node_modues'),
options:{
presets:[
'react',
'stage-0',
['evn', targets:{
browsers:['last 2 versions']
}]
]
}
}]
}
}

返回字符串
react-dom
renderToString from react-dom/server
renderToString(<Home>)

start: 'nodemon --watch build --exec node ./build/bundle.js
build: webpack --config webpack.server.js --watch

npm run all
npm i npm-run-all -g

npm-run-all --parallel dev:\*\*

同构 一套 React 代码运行 在服务器端执行一次 在客户端执行一次

buttion onclick 点击无效

服务端运行 React 代码 渲染输出 HTML
发送 HTML 给浏览器
浏览器接收到内容展示
浏览器加载 JS 文件
JS 中的 React 代码在浏览器端重新执行
JS 中的代码管理页面交互
JS 拿到浏览器上的地址
JS 代码根据地址返回不同路由返回路由内容

路由在客户端 和服务端执行

客户端是 browserRouter
因为服务端使用 static Router
