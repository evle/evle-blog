---
title: 'NodeJS 异步IO 与 文件处理'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/nodejs-io'
category: 'NodeJS'
tags:
  - NodeJS
description: ''
---

## 阻塞型 IO 与非阻塞型 IO

阻塞型 IO 在`sleep`时会等待 5 秒之后打印`wrold`

```javascript
console.log('hello')
sleep(5)
console.log('world')
```

非阻塞型 IO 会直接打印`world`

```javascript
console.log('hello');
setTimeout(5000, function(){
  console.log('5s')
}
console.log('world);
```
