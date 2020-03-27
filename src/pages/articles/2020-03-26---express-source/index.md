---
title: "express核心原理实现"
date: "2020-03-26"
layout: post
draft: false
path: "/posts/express-source"
category: "Node.js"
tags:
  - 
description: ""
---

express是Node.js写服务端的常用框架之一, 集成了路由系统, 使我们很方便的开发web应用, 之前写了一篇Koa的实现原理对比express, 本篇就来接着写一个express的轻量级实现, 来复习下express的设计。

## 最简单的路由系统

最简单的路由系统就是一一对应的, 这里的一一对应指`路径`和`路径处理函数`对应, 用户先注册好路径和对应的处理函数, 当客户端的请求到来时, 使用请求路径去匹配用户已经注册好的路径, 如果匹配, 则调用对应的路由处理函数, 举例说明

1. 用户先注册好路径与其对应的路由处理函数:
  
```javascript
app.get('/', (req, res)=>{
  res.end('your location', req.url)
})
app.get('/about', (req, res)=>{
  res.end('your location', req.url)
})
```

2. 当用户请求到来时, 对比请求路径与已注册的路径是否匹配

```javascript
function App(){
  this.router = []
  
  this.server = http.createServer((req, res)=>{
    for(let i = 0; i < this.stack.length; i++){
      if(this.stack[i].url === req.url){
        this.stack[i](req, res)
      }
    }
  }).listen(3000);
}

App.prototype.get = function(url, fn){
  this.stack.push({url, fn})
}
```

## express路由系统

上面描述了实现路由系统的基本思路, 但光看express下面这种调用方式我们也知道express的路由实现还是稍微复杂一些。

```javascript
app.get("/", (req, res, next) => {
  console.log('I am in router')
  next();
}, (req, res, next)=>{
  console.log('I am in route')
  next();
});
app.get("/", (req, res) => {
  console.log('I am in router')
  res.end("end");
});
```

当请求到来时, 上述代码的执行结果是`1 111 111 2`, 从`next`我们可以猜出内部的实现, 是一个路由执行完之后调用`next`执行下一个路径的递归调用。为了实现上述这种调用方式, express提出了`layer`和`route`和`router`的概念, 下面让我们理一理这个模型。

先画个图来说明一下, 这个图代表上面路由注册代码的模型。

![G9aVsA.png](https://s1.ax1x.com/2020/03/26/G9aVsA.png)

在分析模型时首先分析参与模型的角色: Router, Router的Layer, Route, Route的layer, 总共有4个参与者， 下面来介绍他们的分工:

- Router: 用来维护一个Layer队列, 每当请求来临时, Router迭代自己的Layer队列中的path属性, 去和请求的path做对比, 如果匹配, 则使用Layer队列的dsipatch来执行路径对应的处理函数。

- Router的Layer: 存储着path与dispatch和route, path是用来和来自客户端的请求path做对比, 如果匹配成功则调用route的dispatch来执让route执行路由处理函数, 在上图中对应的是这两次`app.get('/', handler`的调用, 所以模型中有2层。

- Route: Route也维护一个Layer队列, 但与Router的layer队列不同的是, Route的layer队列中存储的是每个路由处理函数。

- Route的Layer: 用来存储每个路由处理函数, 对应着代码第一个`app.get(path, handler1, handler2)`中的handler1和handler2。

了解了角色分工后，我们通过代码来将模型细节化, 先来完成角色Router, Express的中间件是基于路由系统的, 那么路由和中间件有什么区别呢？路由和中间件的区别就是, 中间件没有next方法, 也就是每个中间件就是模型中左侧Router中的一个layer, 不包含route, 那么我们就可以使用`layer.route`在express中判断是一个中间件还是一个路由。

```javascript
Router.prototype.route = function(path) {
  
  /**
  *  路由
  *  Router维护着Layer, 而Layer中又包含route, 因为我们需要创建route, layer，然后将
  *  route挂在layer下, 最后push到Router的stack中。
  **/

  const route = new Route(path)
  const layer = new Layer(path, route.dispatch.bind(route))
  layer.route = route
  this.stack.push(layer)
  return route
}

/**
* 注册中间件, 中间件的Layer存的handler就是中间件处理函数
*           路由的Layer存的handler是Route的dispatch
*/
Router.prototype.use = function(handler){
  let path = '/',router= this._router;
  
  if(typeof handler != 'function'){
    path = handler;
    handler = arguments[1];
  }

  let layer = new Layer(path,handler);

  // 中间件没有route
  layer.route = undefined;
  this.stack.push(layer);
  return this;
} 

/**
*  当请求来临时, 递归遍历自身维护的layer队列, 去比对path
**/
Router.prototype.handle = function(req, res, out) {
  let idx = 0,
    self = this
  let { pathname } = url.parse(req.url, true)
  function next(err) {
    if (idx >= self.stack.length) {
      return out(err)
    }
    let layer = self.stack[idx]


    if(err){
       layer.handle_error(err,req,res,next);
    }else{
         // 用layer.route来判断是路由还是中间件
        if (
          layer.match(pathname) &&
          layer.route &&
          layer.route._handles_method(req.method.toLowerCase())
        ) {
          // 如果路由 使用layer去调用route的dispatch
            layer.handle_request(req, res, next)
          }
        } else if (!layer.route){  // 如果是中间件 则直接运行
          layer.handle_request(req,res,next)
        } else {
            next(err)
        }
    }
  }
  next()
}
```

接下来实现Router的Layer， Router的layer相同于一个中间层, 作用就是匹配路径, 如果匹配到了通知route执行路径处理函数

```javascript
function Layer(path,handler){
		this.path = path;
		this.handler = handler;
}
Layer.prototype.match = function(path){
		return this.path == path;
}
Layer.prototype.handle_request = function(req,res,next){
		this.handler(req,res,next);
}
Layer.prototype.handle_error = function(err,req,res,next){
		if(this.handler.length != 4){
				return next(err);
		}
		this.handle(err,req,res,next);
}
```

最后来实现Route层, Route用来递归运行自己维护的layer, 这里的layer也就是路由处理函数。

```javascript
function Route(path){
	this.path = path;
	this.methods = {};
	this.stack = [];
}

methods.forEach(function(method){
	Route.prototype[method] = function(){
      const handlers = Array.from(arguments);
      // 每一个layer就是一个处理函数, 注册时候先存到Route的stack中
			for(let i=0;i<handlers.length;i++){
					let layer = new Layer('/',handlers[i]);
					layer.method = method;
					this.stack.push(layer);
			}
			this.methods[method] = true;
			return this;
	}
});
Route.prototype._handles_method = function(method){
	return this.methods[method];
}

Route.prototype.dispatch = function(req,res,out){
let idx = 0,self=this;
  // 当被Router中的layer调用时, Route则递归运行自己的layer
  // 当运行结束后, 调用out，开始继续走Router中的layer, 顺序是
  // Router Layer -> Route Layer -> Router Layer
function next(err){
    if(err){
        return out(err);
    }
    if(idx >= self.stack.length){
        return out(err);
    }
    let layer = self.stack[idx++];
    if(layer.method == req.method.toLowerCase()){
        layer.handle_request(req,res,next);
    }else{
        next();
    }
}
next();
}
```

## 写个Express中间件验证一下

body-parser是非常常用的一个express中间件，body-parser可以处理不同类型的post请求体, 编码, 压缩类型等等, 比如最常见的我们想从post请求获取json数据。

```javascript
app.use(bodyParser.json());
```

下面让我们简单实现一下从post请求获取json数据

```javascript
const querystring = require('querystring')

module.exports = (req, res, next) => {
  let arr = []  

  req.on('data', (buffer) => {
    arr.push(buffer)
  })

  req.on('end', () => {
    let body = Buffer.concat(arr).toString()

    // 如果是JSON格式的话则处理成JS对象挂在req.body上面
    if (req.headers['content-type'] === 'application/json') {
      body = JSON.parse(body)
    } else {
      // 处理表单提交数据
      body = querystring.parse(body)
    }

    req.body = body

    // 交由下一级中间件处理 中间件的next很关键 不调用就不走了
    next()
  })
}
```

## 总结

本篇文章总结了express路由和中间件的核心实现, 可以看到最大的不同在于express的中间件是使用callback实现的, 一个next接着一个next, 而Koa的中间件实现是基于Promise, 并且要灵活一些, 可以执行时候暂停下来, 将控制权交出去, 等其他中间件处理完后在得到控制权。





