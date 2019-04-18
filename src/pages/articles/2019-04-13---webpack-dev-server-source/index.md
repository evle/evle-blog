---
title: "从webpack-dev-server看Dev Server功能设计"
date: "2019-04-13"
layout: post
draft: false
path: "/posts/webpack-dev-server-source"
category: "Webpack"
tags:
  - Webpack
  - JavaScript
description: ""
---

Development Server 是我们在开发和调试中必备的工具, gulp、webpack、fis 等前端构建工具都支持这个功能。 Dev Server的核心特性之一就是live reloading, 正如 webpack-dev-server 官方的介绍一样

> Use webpack with a development server that provides live reloading.

除了live reloading之外, Dev Server 还提供了很多特性来提升我们的开发效率比如Proxy和Mock服务。

## Live Reloading

### 原理

live reloading特性允许我们在对代码修改之后可以实时在页面上看到代码的修改结果, live reloading的原理很简单: 它通过向目标文件(例如index.html)注入通讯代码，使目标文件与 Dev Server建立连接, 当Dev Serve检测到目标文件或者目标文件依赖的文件有改动时，发送信号给目标文件让浏览器刷新

### 注入代码



### 实现

从上边的原理我们可以轻易的想到以下实现步骤:

1. 向将被serve的目标文件比如 index.html注入 websocket连接服务器的代码和接收服务器消息的代码  
2. 监听index.html以及其依赖文件的变动, 当有变动时, 服务器(Dev Server)向客户端(index.html)发送消息
3. 客户端(index.html)收到服务器的消息后 `reload()` 页面

根据上面步骤我们可以编写简单实现如下

```javascript
// server.js

const INJECTED_CODE = fs.readFileSync('./injected.html').toString();

const server = http.createServer((req, res)=>{
  res.writeHead(200, {'Content-Type': 'text/html'})
  // var content = fs.readFileSync('./index.html').toString();
  
  // 把socket通信代码注入index.html
  var result = content.replace(/<\/body>/i, `${INJECTED_CODE} </body>`);
  res.write(result);
})

// 监听目标文件改动, 当有改动时向客户端发出reload消息
const chokidar = require('chokidar');
chokidar.watch(process.cwd()).on('change', ()=>ws.send('reload')));

// 等待客户端向服务器端发起连接
server.addListener('upgrade', (request, socket, head) => {
  ws = new WebSocket(request, socket, head);
  ws.onopen = function () {
    ws.send('live reload ready');
  };
});

server.addListener('listening', () => {
  const open = require('open');
  const port = server.address().port;
  // 启动浏览器
  (async () => {
    await open('http://127.0.0.1:' + port);
  })()
});

server.listen(3000)
```

以上我们实现了一个最基础的 live reload 功能, 在监听本地文件变动时 webpack-dev-server 和 vs code插件 live server都使用了 `chokidar` 这个库, 启动浏览器我们使用了 `open`库.

## Proxy


## Mock Service
