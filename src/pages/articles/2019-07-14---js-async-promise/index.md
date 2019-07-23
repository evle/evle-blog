---
title: "JS异步编程从0到1"
date: "2019-07-14"
layout: post
draft: false
path: "/posts/js-async-promise"
category: "JavaScript"
tags:
  - Promise
  - 异步编程
description: ""
---

## 异步存在什么问题？

叫做异步, 代码中使用异步的场景比如读写文件, 异步请求等比比皆是。 那异步存在什么问题? 以读取文件为例看下面的代码

```javascript
import fs from 'fs';

let content = '';
fs.readFile('./fileA', 'utf-8', (err, data)=>{
  content += data;
})

fs.readFile('./fileB', 'utf-8', (err, data)=>{
  content += data;
})

fs.writeFile('./fileC', content, err=>console.log(err))


console.log('hello') // 同步代码, 异步代码会等同步代码执行后再执行
```

我们想分别读取`fileA`和`fileB`两个文件, 然后将读取结果写进`fileC`中, 如果是同步代码, 上面代码可以达到我们预期的效果, 但`readFile`和`writeFile`是异步执行的, 上面的代码可能先运行`writeFile`导致写了空白字符串到`fileC`中那么异步就产生问题了： **我们无法控制异步代码的执行顺序**。

稍加思考我们就得出了最直观解决异步的问题: **嵌套**, 代码改造后如下

```javascript
import fs from 'fs';

let content = '';
fs.readFile('./fileA', 'utf-8', (err, data) => {
  content += data;
  fs.readFile('./fileB', 'utf-8', (err, data) => {
    content += data;
    fs.writeFile('./fileC', content, err => console.log(err));
  });
});
```

这样解决问题的弊端非常明显, 被称为 **callback hell**, 使得代码难以维护, 了解有关更多关于[callback hell in javascript](http://callbackhell.com/)。

## 如何解决异步存在的问题

除了嵌套解决异步的方式外, 我们还可以容易的想到编写一个高阶函数`after`来控制异步的顺序, 当读完每个文件都调用一下标记函数, 当计数达到指定次数时候则执行最后的写入操作

```javascript
const fs = require('fs');

let content = '';

const after = (times, callback) => {
  let count = times;
  return () => --count === 0 && callback();
};

// 执行2次读取操作后 执行写入操作
const done = after(2, () => {
  fs.writeFile('./fileC', content, err => console.log(err));
});

fs.readFile('./fileA', 'utf-8', (err, data) => {
  content += data;
  done();
});

fs.readFile('./fileB', 'utf-8', (err, data) => {
  content += data;
  done();
});
```