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

Development Server 是我们在开发和调试中必备的工具, gulp、webpack、fis 等前端构建工具都支持这个功能。 Dev Server的核心特性之一就是live reloading, 正如 webpack-dev-server 官方的介绍一样

> Use webpack with a development server that provides live reloading.

除了live reloading之外, Dev Server 还提供了很多特性来提升我们的开发效率比如Proxy和Mock服务。

## Live Reloading

### 实现

Live reloading特性允许我们在对代码修改之后可以实时在页面上看到代码的修改结果, live reloading的原理很简单: 它通过向目标文件(例如index.html)注入通讯代码，使目标文件与 Dev Server建立连接, 当Dev Serve检测到目标文件或者目标文件依赖的文件有改动时，发送信号给目标文件让浏览器刷新      

从上边的原理我们可以轻易的想到以下实现步骤:

1. 向将被serve的目标文件  比如 index.html注入 websocket连接服务器的代码和接收服务器消息的代码  
2. 监听index.html以及其依赖文件的变动, 当有变动时, 服务器(Dev Server)向客户端(index.html)发送消息
3. 客户端(index.html)收到服务器的消息后 `reload()` 页面

根据上面步骤我们可以编写简单实现如下

```javascript
// server.js

const INJECTED_CODE = fs.readFileSync('./injected.html').toString();

const server = http.createServer((req, res)=>{
  res.writeHead(200, {'Content-Type': 'text/html'})
  var content = fs.readFileSync('./index.html').toString();
  
  // 把socket通信代码注入index.html
  var result = content.replace(/<\/body>/i, `${INJECTED_CODE} </body>`);
  res.write(result);
})

// 监听目标文件改动, 当有改动时    向客户端发出reload消息
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

注入页面的通讯代码 `injected.html`:

```html
<script type="text/javascript">
	if ('WebSocket' in window) {
		var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
		var address = protocol + window.location.host + window.location.pathname + '/ws';
		var socket = new WebSocket(address);
		socket.onmessage = function (msg) {
			if (msg.data == 'reload') window.location.reload();
		};
		console.log('Live reload enabled.');
	}
</script>
```

以上我们实现了一个最基础的 live reload 功能, 在监听本地文件变动时 webpack-dev-server 和 vs code插件 live server都使用了 `chokidar` 这个库, 启动浏览器我们使用了 `open`库.

## Proxy

代理服务是在开发中常用的一个功能, 举一个例子, 当我们开发时代码运行在`http:localhost:3000/`但是调用的`Server API`运行在`http://localhost:4000/api/`, 那Client的请求代码通常要这样写：

```javascript
fetch('http://localhost:4000/api/posts').then(rawRes=>rawRes.json()).then(res=>{
  // handle res.data
})
```

显然把  请求的API地址写死是一种不好的方式, `https`还是`http`, 端口号是多少这些都是动态的, 写死的话很难管理，所以我们通常会写成：

```javascript
fetch('api/posts').then(rawRes=>rawRes.json()).then(res=>{
  // handle res.data
})
```

这个请求就会请求当前开发服务器的地址也就是 `http://localhost:3000/api/posts`, 那么怎么让它请求`api/posts`时请求API服务器`http://localhost:4000/api/posts`呢？ 这就需要使用proxy来解决这个问题。webpack中我们需要这样设置proxy

```javascript
devServer: {
   proxy: {
        '/api': {
            target: 'http://localhost:4000',
            secure: false
        }
    }
}
```

### 实现

让我们先看下webpack是如何实现这个功能的，webpack实现proxy功能主要使用了`http-proxy-middleware` 这个中间件, 这个中间件的核心就是判断该请求是否被代理，如果需要代理则使用`http-proxy`库将请求发送到指定的服务器:

```javascript
 this.proxy = httpProxy.createProxyServer({})

 async (req, res, next) => {
     // 该请求是否需要被代理
    if (this.shouldProxy(this.config.context, req)) {
      const activeProxyOptions = this.prepareProxyRequest(req);

      // 转发该请求
      this.proxy.web(req, res, activeProxyOptions);
    } else {
      next();
    }
```

接下来我们使用`http-proxy`简单实现一下之前      讨论的场景  将  对`http://localhost:3000/api/posts`的请求转发到服务器`http://localhost:4000/api/posts`。

```javascript
var httpProxy = require('http-proxy');
var connect = require('connect');
proxy = httpProxy.createProxyServer({})

var proxyOptions = {
	target: 'http://127.0.0.1:4000'
} 

app.use((req, res, next)=>{
	if(req.url == '/api/post'){
		proxy.web(req, res, proxyOptions)
	}
	res.end()
})

app.listen(3000);
```

那`http-proxy`这个库又是什么原理转发的请求呢？`http-proxy` 只是调用了Node.js API的`http.request`方法向目标服务器发送了一个请求, 其中关键实现proxying的函数是`stream`：

```javascript
 stream: function stream(req, res, options, _, server, clb) {

    ...
    var http = agents.http;
    var https = agents.https;

    if(options.forward) {
      // 使用 http.request方法实现proxy
      var forwardReq = (options.forward.protocol === 'https:' ? https : http).request(
        // 设置代理的 hostname, path, port, method
        common.setupOutgoing(options.ssl || {}, options, req, 'forward')
      );

      // error handler (e.g. ECONNRESET, ECONNREFUSED)
      var forwardError = createErrorHandler(forwardReq, options.forward);
    }
```

## Mock Service

模拟后端返回的数据进行调试是开发中必不可少的一个流程, 我们通常会使用各种各样的方式进行模拟后端返回的数据， 比如使用一些第三方Ajax库提供的拦截请求功能, 拦截指定的请求并创建一个`Response`对象模拟返回的结果。使用`webpack-dev-server`我们可以很方便的模拟后台的数据, 只要    在中间件中判断  `req.url`并回应相应的数据    , 为了方便我们使用express创建一个基于 webpack 的mock服务。

```javascript
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackOptions = require('./webpack.config.js')
const fs = require('fs');

webpackOptions.mode = 'development'

const compiler = webpack(webpackOptions)
const express = require('express')
const app = express()

app.get('/', (req, res)=>{
	res.end(fs.readFileSync('./index.html'))
})

app.use(middleware(compiler, {}))

app.get('/fruits', (req, res) => {
	res.json({ data: [
		{id:1, text:'apple'},
		{id:2, text:'orange'},
		{id:3, text:'mangosteen'},
	]})
})

app.listen(3000, () => console.log('App listening on port 3000!'))
```

当我们用户访问`http://127.0.0.1:3000`的时候我们会返回给用户`index.html`文件,         `index.html` 文件中请求了`/api/fruits`

```html
	<script>
    fetch('api').then(res=>res.json()).then(res=>console.log(res.data));
    // output: [{id:1, text:'apple'},{id:2, text:'orange'},{id:3, text:'mangosteen'}]
  </script>
```

从上面实现Mock功能  我们可以看到搭建一个Mock服务很简单, 原理就是写一个 Koa 或者 Express服务返回模拟的数据, 但是像这样配置路由有点繁琐,我们可以更便捷的模拟后端的数据通过`json-server`, 可以完全通过配置文件或控制面板让测试人员随便修改后端返回的数据。

