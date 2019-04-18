---
title: "FIS3 source analysis"
date: "2019-04-14"
layout: post
draft: true
path: "/posts/FIS3-source-analysis"
category: ""
tags:
  - 
description: ""
---

> FIS3 面向前端的工程构建系统。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。

FIS3 是百度开发的一款定制前端构建的工具, 对比Webpack, FIS3是一款更轻量的构建工具, 希望通过本篇对FIS3源码的分析, 能使我们对前端工程化有更深刻的理解.

fis-config.js

## 部署项目

资源定位的问题, 无需关心部署路径与开发路径导致的问题

## 配置文件


## 工作原理

FIS3 基于文件对象进行构建, 每个进入FIS3的文件都会实例化为File对象

var src = rootDir
var files = {}
src.forEach(el=>{
  var file = new File(el);
  files[file.path] = fis.compile(file);
})

fs.compile = function(file){
  if(file.parser){
    pipe('parser', file);
  }
  if(file.preprocssor){
    pipe('preprocssor', file)
  }

}


fis.match('*.es6', {
  parser: fis.plugin('babel'),
  rExt: '.js' // 代码编译产出时，后缀改成 .js
});

给es6后缀的文件 加一个parser
function File(filepath) {
  var props = path.info(filepath);
  merge(props, fis.matchRules(filepath)); // merge 分配到的属性
  assign(this, props); // merge 属性到对象
}

编译的核心
资源定位 开发转为线上
内容嵌入 把一个文件内容嵌入另一个文件
依赖声明 在文件内标记对其他资源的依赖


## 源码入口 ./bin/fis.js

 