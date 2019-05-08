---
title: 'nodejs event'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/nodejs-event'
category: 'NodeJS'
tags:
  - NodeJS
description: ''
---

## 事件

### 事件基础

浏览器中的事件绑定通过`addEventListener`接口, 比如监听一个 Ajax 状态是否变化我们可以监听`stateChange`然后通过判断

Nodejs 实现事件

var EventEmitter = require('events').EventEmitter;
var a = new EventEmitter;

a.on('event', function(){
console.log('event called');
})

a.emit('event')
