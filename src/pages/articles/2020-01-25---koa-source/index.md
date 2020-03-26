---
title: "从Koa核心功能实现对比与Express的区别"
date: "2020-01-25"
layout: post
draft: false
path: "/posts/koa-source"
category: "Node.js"
tags:
  - 
description: ""
---

很久没有看express源码了, 温故知新, 现在时间充足可以将express的核心源码实现一遍, 说起express不得不提Koa, 本篇文章将回顾Koa的核心实现, 以及与Express做一个对比。

## 文件结构

看Koa和Express的源码可以看出他们最明显的区别是: Koa使用ES6语法实现, 而express还是ES5的语法, Koa的核心文件只有四个

- application.js
- request.js
- response.js
- context.js

`applicatoin.js`是Koa的核心, 比如监听http端口, 处理中间件。`request.js`和`response.js`则是对原生http的request和response做扩展, `context.js`提供了`ctx`对象, 算是Koa与Express的第二个区别点, 当收到Http Incoming请求的时候, Koa将request与response包装在了`ctx`对象中, 并且提供了很多便利的操作方式, 而Express则是使用原生的requeset与response对象, 并且对其进行了扩展。

## ctx对象的实现

在Koa中, 我们的request handler会被传入一个ctx对象来简化我们的操作, 比如我们当取得request的`url`属性, 我们可以使用以下4种方式

```javascript
ctx.req.url
ctx.request.url
ctx.request.req.url
ctx.url
```

`ctx.req`是原生的request即

```javascript
_createContext(req, res){
  let ctx = Object.create(context)
  ctx.req = req;
  return ctx;
}
```

所以我们可以拿到原生request的`url`属性通过`ctx.req.url`, 但是`ctx.request`中的`request`只是一个普通的对象来自`request.js`并没有`url`属性, 那改如何拿? Koa使用了对象的getter方法, 通过getter返回`this.req.url`, 通过 this拿到了this.req.url

```javascript
let request = {
  get url(){
    return this.req.url
  }
}
module.exports request;

ctx.request.url // this指向了ctx
```

`ctx`对象中还有一个重要的属性是`body`, 通过给`body`赋值可以响应给浏览器结果, body来自`context.js`, 也是一个普通对象, 通过getter和setter设置内部的body属性

```javascript
let context = {
  _body: undefiend,
  get body(){
    return this._body
  }
  set body(body){
    this._body = body
  }
}
```

每当中间件对`ctx.body`赋值, 其实就是对context内部的_body赋值, 等待所有中间件执行完毕的时候来根据`ctx.body`的值来响应客户端。

```javascript
  if(typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)){
    // 返回字符串 设置响应头 
  }
  if(typeof ctx.body === 'object'){
    // 返回json 设置响应头 
  }
  if(typeof ctx.body instanceof Stream){
    // 返回流 设置响应头 
  }
  if(typeof ctx.body === 'undefined'){
    // 设置状态吗204 No Content
  }
```

## 中间件的实现

中间件是Express和Koa的核心特性, 但实现却完全不同, Koa的中间件由是基于Promise实现的, 配合`await`写代码很舒服, 而Express则是使用`callback`实现的, 比如如果要统计一个中间件的处理时间, 那么用Koa很简单, 只要在中间件前后计算中间差即可, 但是Express实现同样的需求必须重写`res.end`方法, Express的中间件是基于路由的, 也就是对路由有强依赖, 但是Koa的中间件实现很简单, 就是一个递归调用所有的中间件  

首先通过`use`来注册中间件3个中间件, 需要注意2个点, 一是`await`只会等待Promise，因为所有的异步操作需要封装成Promise, 比如`sleep`, 另一个需要注意的点是我们不知道下一个中间件是同步还是异步任务, 所以统一使用`await next()`来确保中间件的执行顺序正确。

```javascript
const sleep = (delay)=>new Promise((resolve, reject)=>{
  setTimeout(()=>resolve(), delay)
})

app.use(async (ctx, next)=>{
  console.log(1)
  await next();
  console.log(2)
})
app.use(async (ctx, next)=>{
  console.log(3)
  await sleep(2000) // 异步任务需要封装成 Proimse
  await next();
  console.log(4)
})
app.use(async (ctx, next)=>{
  console.log(5)
  await next();
  console.log(6)
})
```

注册中间件之后, 需要递归的遍历这些异步中间件

```javascript
let ctx = this._createContext(req, res);

let idx = 0;
const dispatch = () => {
  if (idx === this.stack.length) return Promise.resolve();
  let middleware = this.stack[idx++];
  return Promise.resolve(middleware(ctx, dispatch));
};
dispatch();
```

通过上面的简单实现我们可以看到, Koa在处理中间件时是如果遇到`next`则将控制权交给下一个中间件, 等下一个中间件执行完且没有next, 才开始返回, 执行next()之后的代码。而Express则是一个接着一个执行。

此外, Koa和Express对中间件中的错误捕获处理也完全不同, Koa继承了`events`, 可以在全局监听一个`error`事件, 当`try..catch`到的异步错误被捕获后, 使用`emit`发送错误即可。

```javascript
app.on('error', e=> console.log(e))

const dispatch = () => {
  if (idx === this.stack.length) return Promise.resolve();
  let middleware = this.stack[idx++];
  try{
    return Promise.resolve(middleware(ctx, dispatch));
  }catch(e){
    this.emit('error', e)
  }
}

dispatch();
```

Express在捕获错误的时候相比Koa复杂, 如果有中间件发生错误时则在调用`next(err)`即给next参数error参数, 如果检查到next中有参数的话, 则会停止运行后面的中间件, 直接跳到有4个参数的中间件且第一个参数是error的错误处理中间件来执行。

## 总结

本文通过对实现了一个Koa核心功能进行了梳理, 并且与Express对比得到以下结果:

- Koa使用ES6语法, Express使用ES5
- Koa中间件执行时遇到next会执行下一个中间件,等下一个执行完在返回继续执行, Express中间件会一个接一个执行
- Koa捕获中间件错误通过try...catch捕获, 并且通过事件通知错误, 而Express则是通过给next传递error参数, 使用错误处理中间件来捕获中间件错误
- Koa中间件使用Promise实现, Express则是使用回调函数。


