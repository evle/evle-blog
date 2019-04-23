---
title: "理解模块打包工具Rollup"
date: "2019-04-20"
layout: post
draft: true
path: "/posts/understanding-rollup"
category: "Rollup"
tags:
  - JavaScript
  - Rollup
description: ""
---

## 介绍

bundler这个词在前端工程化中是个高频词, 那当提到bundler时我们在聊什么？首先我们必须先要聊一聊模块化编程, 在没有ES标准模块和AMD, CMD等模块化标准的时候, 我们想要模块化开发通常会做以下两步:

1. 把代码按照功能分离成一个一个的js文件
2. 在HTML页面中插入`script`标签引用每个文件, 并要保证依赖顺序

但是页面中多个`script`标签导致发多次网络请求引起的性能问题让我们不得不想办法将多个js文件合并成一个。那么bunlder就出现了, bundler除了将多个js文件合并成一个之外还会做一些额外的工作, 比如移除没有用到的代码和压缩代码的功能来提高我们的应用性能。目前比较流行的bundler工具是Webpack, Rollup, Parcel。本文不是Rollup的安利文所以不过多的比较Webpack和Rollup, 我们从将从Rollup的基本使用一步一步分析Rollup的工作原理。

## f





创建模块 

```javascript
export default ()=> 'Module A'
export default ()=> 'Module B'
```
The above code uses import/export and not require() and module.exports. Rollup expects the modules that it uses to use ES2015 imports/exports so that it can perform static analysis of your code (basically, to determine what code is necessary in your application).

项目中的每个模块 rollup都会使用它的loader创建module
在这个过程中有有2个关键过程

- 解析
对代码的解析使用了 Acron， 使用Acron会解析称一个module 并且初始化这个module相关的东西

- 分析 Analysis
解析成module之后的下一步就是分析了, 首先开始遍历Ast并且给每个节点设置`parent` `module` 
`keys`







## 流程分析

程序的entry file是 `./bin/src/index.ts`, 使用`minimist`初步处理完参数后调用`./bin/src/run/index.ts`开始进一步处理参数和配置文件然后调用`build(options)`, 该函数返调用`./src/rollup/index.ts`开始真正的bundler处理流程。

```javascript
// build.ts
function build(inputOptions, outputOptions)
  return rollup
    .rollup(inputOptions)
    .then((bundle: RollupBuild) => {...})
...

`rollup`中核心的graph这个对象

```javascript
function rollup(input){
  const graph = new Graph(input);

}
```