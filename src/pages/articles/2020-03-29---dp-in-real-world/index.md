---
title: "设计模式在真实世界中的应用"
date: "2020-03-29"
layout: post
draft: true
path: "/posts/dp-in-real-world"
category: "JavaScript"
tags:
  - 
description: ""
---

> 设计模式离我们很近 

本篇文章将追寻设计模式在我们日常开发中的影子, 以帮助我们更优雅, 合理的编写代码.

## 不得不说的SOLID

> 设计模式的价值在需求不断变化时才能体现出来

SOLID中的五条原则在JS方面的应用大概就是:

如果觉得太复杂, 那么可以拆分成多个简单的
如果经常变动, 那么就写成扩展新代码, 而非修改老代码

## 不得不说的面向对象

继承, 封装, 多态是每个开发人员都知道的面向对象三大特性, js这种从一开始就没有按照面向对象设计的语言如何实现面向对象的特性呢?

### 继承

继承可以把公共方法抽离出来，提高复用，减少冗余, 缺点: 会继承用不到的东西

### 封装

将数据封装起来, 减少耦合, 不该访问的不能访问, 遗憾的是es6没有访问修饰符, 幸运的是ts有

public: 类内或者类外
protected:本类和子类中使用
private: 类内使用

### 多态

同一个接口可以有不同的实现, 面向接口编程, 灵活


## 工厂模式

### 简单工厂

由工厂来产生实例, 比如点咖啡, 和咖啡工厂说要一杯美式

```javascript
abstract class Coffee{
  constructor(public name: string)
}

class Americano extends Coffee{}
class Latte extends Coffee{}

class CafeFactory{
  static order(name: string){
    switch(name){
      case: 'Americano':
        return new Americano();
      case: 'Latee':
        return new Latte();
      default: 
        throw new Error('unknow coffee')
    }
  }
}

CafeFactory.order('Americano')
```

缺点: 咖啡种类多的话一直增加, 违反SOLID原则

真实由工厂产生实例的例子:

```javascript
class jQuery{
    constructor(selector){
        let elements = Array.from(document.querySelectorAll(selector));
        let length = elements?elements.length:0;
        for(let i=0;i<length;i++){
            this[i]=elements[i];
        }
        this.length = length;
    }
    html(){

    }
}
window.$ = function(selector){
   return new jQuery(selector);
}

class Vnode{
    constructor(tag,attrs,children){
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
    }
}
React.createElement = function(tag,attrs,children){
  return new Vnode(tag,attr,children);
}
```

### 工厂方法

卖咖啡的都是不同的工厂, 不是直接返回实例, 是通过不同类型的工厂做咖啡


### 抽象工厂




## 单例模式

### Redux中的store

整个应用中应该有唯一的state, 存储在store中

```javascript
function createStore(reducer) {
    let state;
    let listeners=[];
    function getState() {
        return state;
    }
    function dispatch(action) {
        state=reducer(state,action);
        listeners.forEach(l=>l());
    }
    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(item => item!=listener);
            console.log(listeners);
        }
    }
    dispatch({});
    return {
        getState,
        dispatch,
        subscribe
    }
}
let store = createStore();
```

### window存一个唯一实例

```javascript
let  Window = function(name) {
    this.name=name;
}
Window.prototype.getName=function () {
    console.log(this.name);
}
Window.getInstance=(function () {
    let window=null;
    return function (name) {
        if (!window)
           window=new Window(name);
        return window;
    }
})();
let =Window.getInstance('zfpx');
window.getName();
```

### 缓存或者localStorage

## 适配器模式

旧接口和使用者不兼容, 改造旧接口? 不行, 旧的使用者会受影响. 解决方法: 中间加一个适配层

### promisify

node中可以使用promisify将fs接口包装以下, 使callback变成promise的使用方法

```javascript
let fs=require('fs');
function promisify(readFile) {
    return function (filename,encoding) {
        return new Promise(function (resolve,reject) {
            readFile(filename,encoding,function (err,data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            })
        });
    }
}
let readFile=promisify(fs.readFile);
readFile('./1.txt','utf8').then(data => console.log(data));
```

### Ajax接口的多种使用方式

```javascript
let $={
    ajax(options) {
        fetch(options.url,{
            method: options.type,
            body:JSON.stringify(options.data)
        })
    }
}
```

## 装饰器模式

### AOP

用来改写某些函数


## 代理模式

代理就是个中间人, 可以劫持

### 事件委托

```javascript
<ul id="list">
      <li>1</li>
      <li>2</li>
      <li>3</li>
</ul>

let list = document.querySelector('#list');
list.addEventListener('click',event=>{
  alert(event.target.innerHTML);
});
```

### 代理跨域

## 观察者模式

观察者模式太常见了, 事件绑定, Promise, callbacks, 生命周期函数, redux 哪里都少不了它的影子


## 状态模式

## 访问者模式

遍历AST的库通常都是写成访问者模式, 将数据操作和数据结构进行分离, 
