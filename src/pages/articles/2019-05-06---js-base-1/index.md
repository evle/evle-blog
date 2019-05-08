---
title: 'js base 1'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/js-base-1'
category: 'JavaScript'
tags:
  - JavaScript
description: ''
---

遍历对象

for...in

```javascript
packJson = [
  { name: 'nikita', password: '1111' },

  { name: 'tony', password: '2222' },
]

for (var p in packJson) {
  //遍历json数组时，这么写p为索引，0,1
  console.log(packJson[p].name + ' ' + packJson[p].password)
}
```

便利 entries
for ... of
for(let url in urlparams())


原型链
首先Array function Person Object即是构造函数也都是对象
proto是对象的指向创造自己的构造函数的prototype
protottype是函数的


prototype是用于共享数据的
_proto_让对象可以从prototype继承属性和方法

constror函数特有 new的时候该实例继承了prototype的属性和方法

1. Object 原型链顶端是Object.prototype
所有对象 函数 的prototype 都继承自 Object.prototype
所以Object.prototype.x = 1
var a = []; a.x  // 1
function c(){}; c.x // 1
Array.prototype.x // 1
Array._proto_.x // 1
Function.prototype.x // 1
Function._proto_.x // 1








那么Array.prototype.a Function.prototype.a 都会等于10
它们都是继承顶端


1. 构造函数创建的对象 Array Function Person Object 都是Function的实例
array._proto_ 和 array.prototype 是相等的
Array.prototype.a = 1
Array._prto_.a = 1









prototype用于共享数据的 比如Function.prototype Array.prototype Person.prototype 在上面添加了方法则相当于是在 


构造函数function  array object 都是Function实例 都有_proto_ 指向Function.prototype

