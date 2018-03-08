---
title: "Node.js Foundation"
date: "2017-09-30T05:36:48.284Z"
layout: post
draft: false
path: "/posts/node-foundation/"
category: "Node.js"
tags:
  - "Node.js"
description: "Node.js"
---
[TOC]
## Prepare for happy hacking
- Node.js Installation: `brew install node`
- REPL mode: `node`  
- Execution: `node app.js`

[查看Node.js API](https://nodejs.org/api/)

### NPM Usage:
*NPM* 是node.js的第三方包管理工具，在开始node.js项目之前，通常在该目录下创建`package.json`文件来管理第三包以及项目信息.
1. 初始化`package.json`文件
```
$ npm init
```
2. 搜索 nodejs 第三方包
```
$ npm search express
```
3. 安装第三方包
```
$ npm install -g express  // 全局安装
$ npm install --save express // 本目录下安装
```
4. 更新
```
$ npm update express
```
5. 卸载
```
$ npm uninstall express
```

## Module
导出：`exports`或者`module.exports`
导入：`require`
**index.js**:
```
const hello = require('./hello');
const Cat = require('./cat');

hello.hello();

let cat = new Cat();
cat.eat();
cat.sleep();
```
**hello.js**:
```
function hello{
  console.log('hello from hello.js');
}
exports.hello = hello;
```
**cat.js**:
```
function cat(){
  this.eat = function eat(){
    console.log('eat');
  }
  this.sleep = function sleep(){
    console.log('sleep');
  }
}

module.exports = cat;
```
## Events
node.js的特性之一就是 **event-driven**，比如`fs.readStream`在读取文件时会产生一个事件. 所有像这样可以产生事件的对象都是`events.EventEmitter`的 *instance*. EventEmitter的 *instance* 通常会出发`error`事件,例如
```
fs.mkdir('./newdir', (err) => {}))
```
### 监听事件
`emitter.on(event, listener)` or `emitter.addListener(event, listener)`
只生效一次:`emitter.once(event, listener)`

### 移除监听
`removeListern(event, listener)`
全部移除: `removeAllListeners()`

### 设置/查询 监听器个数
设置：`events.EventEmitter.defaultMaxListeners = 20;`
查询：`const cnt = events.EventEmitter.listenerCount(server, 'myevent');`

### 自定义事件
```
server.on('myevent', (arg) => {
    console.log('receive event: ' + arg);
});

server.emit('myevent', 'it\'me');
```
## fs module
`require('fs')` for file operation

### 删除文件
`fs.unlink('filename', (err) => {})`

### 创建目录
`fs.mkdir('./newdir', (err) => {})`

### 读取目录
`fs.readdir('./', (err, files) => {})`

### 读/写文件
`fs.readFile('filename', 'utf-8', (err, data) => {})`
`fs.writeFile('filename', 'something new', { 'flag':'a+'}, (err, data) => {})`

| flag | note                                         |
| ---- | -------------------------------------------- |
| r    | 读取文件，文件不存在时报错                   |
| r+   | 读取并写入文件，文件不存在时报错             |
| rs   | 以同步方式读取文件，文件不存在时报错         |
| rs+  | 以同步方式读取并写入文件，文件不存在时报错   |
| w    | 写入文件，文件不存在则创建，存在则清空       |
| wx   | 和w一样，但是文件存在时会报错                |
| w+   | 读取并写入文件，文件不存在则创建，存在则清空 |
| wx+  | 和w+一样，但是文件存在时会报错               |
| a    | 以追加方式写入文件，文件不存在则创建         |
| ax   | 和a一样，但是文件存在时会报错                |
| a+   | 读取并追加写入文件，文件不存在则创建         |
| ax+  | 和a+一样，但是文件存在时会报错               |

### 读/写
```
const fs = require('fs');

fs.open('filename', 'w+', (err, fd) => {
    if (err) {
        throw err;
    }

    // Write
    let bufWriter = new Buffer('node.js from zero to hero!');

    fs.write(fd, bufWriter, 0, bufWriter.length, 0, (err, bytes, buffer) => {
        if (err) {
            throw err;
        }

        console.log('W: ' + buffer.slice(0, bytes));
    });

    // Read
    let bufReader = new Buffer(255);
    fs.read(fd, bufReader, 0, 100, 0, (err, bytes, buffer) => {
        console.log('R: ' + buffer.slice(0, bytes));
    });

    fs.close(fd);
});
```

## process
process 也是 EventEmiter的一个 *instance*

### 信号事件
Node.js支持标准的 [*POSIX signal*](http://man7.org/linux/man-pages/man7/signal.7.html)
```javascript
// Example: Interrupt from keyboard(control-c)

process.stdin.resume(); // begin reading from stdin

process.on('SIGINT', () => {
  console.log('Received SIGINT.  Press Control-D to exit.');
});
```
### 获取输入流
```javascript
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk) {
        process.stdout.write(`data: ${chunk}`);
    }
});

process.stdin.on('end', () => {
    process.stdout.write('end');
});
```

## net & dgram module
`require('net')` for building TCP server
`require('dgram')` for building UDP server

### TCP Server
#### 创建TCP Server
`const server = net.createServer((socket) => {})`

#### 接收来自客户端的消息
`socket.on('data', (data) => {})`

#### 发送数据给客户端：
`socket.write('message')`  

#### 监听
`server.listen(port, () => { 'server is running'})`

### TCP Client  

#### 连接TCP Server
`const client = net.connect({port: 8080}, function() {});`

#### 发送数据给服务器端:
`client.write('message')`

#### 接收来自服务器的消息
`client.on('data', (data) => {})`

#### 断开连接
`client.end()`

### UDP Server
#### 创建UDP Server
`const server = dgram.createSocket('udp4')`

#### 接收来自客户端消息
`server.on('message', (msg, client) => { client.port/address})`

#### 监听
`server.on('listening',() => { server listening on server.address()})`

#### 绑定
`server.bind(port)`

### UDP Client
#### 创建UDP Client
`const client = dgram.createSocket('udp4')`

#### 发送数据给服务器端
`client.send(msg, msg.length, port, address, callback())`

### Example: Chat
**Server.js**
```
const net = require('net');

const sockets = [];
const server = net.createServer();

server.on('connection', (socket) => {
    console.log('A client connected');
    sockets.push(socket);

    socket.on('data', (data) => {
        sockets.forEach((sock) => {
            if (sock != socket) {
                sock.write(data);
            }
        });
    });

    socket.on('close', (data) => {
        console.log('A client connection closed');
        let index = sockets.indexOf(socket);
        socket.splice(index, 1);
    });
});

server.listen(3333);
```

**Client.js**
```
const net = require('net');

process.stdin.resume();

const client = net.connect(3333, () => {
    console.log('Connected to server');
});

process.stdin.on('data', (data) => {
    client.write(data);
});

client.on('data', (data) => {
    console.log(data.toString());
});
```

### http module
Using `http` module to build a **Web Server**.
```
app
├── app.js
├── requestHandlers.js
├── router.js
├── server.js
└── views
    ├── 404.html
    └── home.html
```

#### app.js
**app.js** 是程序的入口，设置路由并且启动服务器.
```javascript
const server = require('./server');
const router = require('./router');
const requestHandlers = require('./requestHandlers');

const handle = {};
handle['/'] = requestHandlers.home;

server.start(router.route, handle);
```

#### server.js
创建服务器, 将服务器接收到的客户端请求传递给路由处理
```javascript
const http = require('http');
const url = require('url');
const fs = require('fs');

const host = '127.0.0.1';
const port = 8080;

function start(route, handle) {
    function onRequest(req, res) {
        const pathname = url.parse(req.url).pathname;
        console.log('Request for ' + pathname + ' received.');

        route(handle, pathname, res, req);
    }

    http.createServer(onRequest).listen(port, host);
    console.log('Sever has started and listenning on' + host + ':' + port);
}

exports.start = start;

```
#### router.js
判断路由是否合法
```javascript
var fs = require('fs');

function route(handle, pathname, res, req) {

    if (typeof handle[pathname] === 'function') {
        handle[pathname](res, req);
    } else {
        var content = fs.readFileSync('./views/404.html');
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write(content);
        res.end();
    }
}

exports.route = route;
```

#### requestHandlers.js
处理每个请求
```javascript
const fs = require('fs');

function home(res) {
    const content = fs.readFileSync('./views/home.html');
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(content);
    res.end();
}

exports.home = home;
```

## Express
### 构建项目
```
$ mkdir node-express && cd node-express
$ npm init
$ npm i --save express
```
### Code Base
```
const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello Express');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
```
### 获取Query
```
// http://localhost:3000/?q=something
let q = req.query.q;
let md5Value = utility.md5(q);
res.send(md5Value);
```
### Web Scraping
Web scraping is a technique in data extraction where you pull information from websites.
依赖模块: `superagent`, `cheerio`

#### superagent
##### 获取指定网页内容
```
superagent.get('https://github.com/topics/nodejs')
        .end(function (err, content){
          console.log(content);
        }
```
#### cheerio
[read more](https://github.com/cheeriojs/cheerio)
[实例: 获取评分最高的电影从http://www.imdb.com](https://github.com/evle/top-rated-movies-scraping)
##### Loading
```
const $ = cheerio.load(content.text);
const $ = cheerio.load('<ul id="fruits">...</ul>');
```
##### Selectors
```
$('.apple', '#fruits').text()
$('ul .pear').attr('class')
$('li[class=orange]').html()
```
##### Attributes
```
$('ul').attr('id')
$('.apple').attr('id', 'favorite').html()
```

#### eventproxy



#### Travis CI - Test and Deploy with Confidence
