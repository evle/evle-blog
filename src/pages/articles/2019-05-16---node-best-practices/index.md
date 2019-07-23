---
title: "node best practices"
date: "2019-05-16"
layout: post
draft: true
path: "/posts/node-best-practices"
category: "NodeJS"
tags:
  - NodeJS
description: ""
---

Layer app
组件分层: web serverice, DAL Data Access 解耦 测试
尽可能降低对依赖

config分层配置文件

分离 app.js 与 server.


处理错误 禁止使用回调
promise & async-await

function appError(name, httpCode, description, isOperational) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.name = name;
    //...在这赋值其它属性
};

appError.prototype.__proto__ = Error.prototype;

module.exports.appError = appError;
 
//客户端抛出一个错误
if(user == null)
  throw new appError(commonErrors.resourceNotFound, commonHTTPErrors.notFound, "further explanation", true)

  return new Error


区分运行错误和程序设计错误






