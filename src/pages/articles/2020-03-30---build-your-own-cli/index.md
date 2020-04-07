---
title: "编写脚手架减少重复的劳动"
date: "2020-01-15"
layout: post
draft: true
path: "/posts/build-your-own-cli"
category: "Node.js"
tags:
  - 
description: ""
---

## 准备起航

- commander
- inquirer
- download-git-repo
- chalk
- metalsmith  读取所有文件 实现模版渲染
- consolidate 同一模版引擎
- ora 进度条
- ncp
- 

npx eslint --init 
eslint: auto fix on save


封装等待helper

```javascript
const withLoading = (cb, message)=> async (...args)=>{
  const spinner = ora(message);
  spinner.start();
  const result = await cb(...args);
  spinner.succeed();
  return result;
}
```