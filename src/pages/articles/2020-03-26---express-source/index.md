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

## 从ES5开始

express使用ES5写的, 相关的ES5知识会一并梳理到本篇内容当作复习。

### ES5的类

es5没有class的概念, 但有构造函数, 所以可以使用`new`一个构造函数来实现一个类

```javascript
function Person(name){
  this.name = name;
}
Person.prototype.sayHi = function(){
  console.log('hi I am ', this.name)

}

var person = new Person('evle');
person.sayHi()
```

问题1: 在Person内部通过`this`定义属性和在`prototype`上定义属性/方法有什么区别？
答: 节省内存, 当调用`sayHi`会优先调用Person内部定义的`sayHi`, 没有才去找`prototype`

问题2: Person如何实现一个私有变量? 答: 使用闭包

```javascript
function Person(){
  let private = 10;
  this.getPrivate = function(){
    return private;
  }
}
```

问题3: new做了什么事情?

问题4: Object.create做了什么事情?

问题5: 如何实现继承?

问题6: 原型链怎么找的?

问题7: 作用域链又是怎么找到的?


## Express路由系统实现

### 从使用看其内部实现

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

这是路由实现的基本思路, 但光看express下面这种调用方式我们也知道express的路由实现还是稍微复杂一些。

```javascript
app.get(
  "/",
  (req, res, next) => {
    console.log(1);
    next();
  },
  (req, res, next) => {
    console.log(11);
    next();
  },
  (req, res, next) => {
    console.log(111);
    next();
  }
);

app.get("/", (req, res) => {
  console.log(2)
  res.end("end");
});
```

当请求到来时, 上述代码的执行结果是`1 111 111 2`, 从`next`我们可以猜出内部的实现, 是一个路由执行完之后调用`next`执行下一个路径的递归调用。为了实现上述这种调用方式, express提出了`layer`和`route`和`router`的概念, 下面让我们理一理这个模型。

先画个图来说明一下

![G9aVsA.png](https://s1.ax1x.com/2020/03/26/G9aVsA.png)

上面的图对应下面这样的使用方式:

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

每当用户调用`app.get`注册时, 相当于在`Router`的stack中增加来一个`Layer`, `Layer`中存储了路径和一个运行路由的方法, 运行路由的方法是`Route`提供的。第一个`app.get`注册的2个路由处理函数会传入Route中, 并由Route生成2个layer维护起来，每个layer中存储path，path对应的处理函数, 以及对应的请求类型(method)。

直接这么说太抽象了, 左侧的Router和右侧的Route, 以及左侧的layer和右侧的layer分别是四个不同的东西! 下面我们来说说模拟一个请求到来时, 是怎么被这个路由处理的。当请求来临时, 首先会遍历Router, Router拿出每个layer的path来和请求的path对比, 如果相同的话, 则由Router的layer来通知route执行route内部维护的一系列layer, 下面使用代码描述。

首先在用户注册路由的时候, 会将route挂在layer上, 并且将layer压入Router.stack

```javascript
 const route = new Route(path);
 const layer = new Layer(path,route.dispatch.bind(route));
 layer.route = route;
 this.stack.push(layer);
 return route;
```

当请求来临时:

```javascript
Router.prototype.handle = function(req,res,out){
  let idx=0,self=this;
  let {pathname} = url.parse(req.url,true);

  // 当请求来时, 递归遍历Router中的layer
  function next(err){
      if(idx >= self.stack.length){
          return out(err);
      }
      let layer = self.stack[idx++];
      // 如果用户请求的路径和layer的路径匹配的话
      if(layer.match(pathname) && layer.route&&layer.route._handles_method(req.method.toLowerCase())){
        
        // 让layer通知Route执行所有的路由处理函数
        layer.handle_request(req,res,next);
      }else{
          next();
      }
  }
  next();
}
```

`layer.handle_request`调用了Route的dispatch方法来执行所有的路由处理函数, 这里有一点是要注意的, 下面的参数`out`是Router中的layer传递进来的next, 也就是说当执行完所有的路由处理函数后, 调用`out`, 来接着走`Router`中的layer, 是一个串行, 这段代码也就是下面这样的顺序。

```javascript
Router中layer1 -> Route中layer1 -> Route中layer2 -> Router中layer2
```

```javascript
Route.prototype.dispatch = function(req,res,out){
    let idx = 0,self=this;

    //  Route将自身维护的layer递归全部执行,
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

Route维护layer

```javascript
(handler) => {
  for(let i=0;i<handlers.length;i++){
      let layer = new Layer('/',handlers[i]);
      layer.method = method;
      this.stack.push(layer);
  }
}
```











理解了这个关系后实现起来也很简单, 下面我们也使用es5的语法来实现上述的模型。






## Express二级路由实现

我的理解软件工程的核心意义是降低系统复杂度, 而拆分则是主要方法论之一, 在写express应用时候我们通常会使用二级路由将应用根据逻辑拆分成不同的业务单元便于维护.

```javasript

```

实现这样的二级路由的关键点是:

改造我们的路由系统, 使其支持二级路由

```javascript

```

## Express中间件实现

在实现了路由系统后, express的中间件的实现则变得很简单, express中间件和路由有什么区别?

```javascript
```

我们可以看到中间件是没有的, 我们只要在原来的路由系统中, 根据中间件没有xx的特性, 来判断出中间件即可


在中间件/路由中如何捕获错误? express相比koa可以用`try...catch`捕获然后通过事件系统dispatch出去则稍微复杂来一点, 



## Express对原生reqeust和response的扩展


## 总结

本篇文章总结了ES5关于类的相关知识点, 掌握JS基础可以使我们走的更远. 此外本篇文章也总结了express路由和中间件的核心实现, 并且写了2个常用的中间件。




