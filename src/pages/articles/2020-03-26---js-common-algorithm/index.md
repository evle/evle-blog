---
title: "JavaScriptf精进之常用算法实现"
date: "2020-03-26"
layout: post
draft: false
path: "/posts/js-common-algorihtm"
category: "JavaScript"
tags:
  - 
description: ""
---

下个月开始面试, 复习一遍常用的API实现与算法.

## reduce

我认为reduce的掌握是很关键, 可以轻松实现异步串行, 数据聚合等需求, 我们需要适应使用reduce解决问题。

`reduce`是`Array.prototype`上的一个方法, 它的核心功能是迭代, 第一个参数左边是上一次计算结果, 右边是当前遍历的值, 第二个参数是初始化值, 举🌰说明:

```javascript
// 实现一个inclues
const value = 'cat'
if (value === 'cat' || value === 'dog' || value === 'pig'){
    // statement
}
// => 
if(['cat', 'dog', 'pig'].includes(value)){
    // statement
}

Array.prototype.includes = function(target){
  return this.reduce((acc, value)=>{
    if(value === target) acc=true
      return acc
    }, false)  // 初始化acc=false
}
```

起初给`acc`初始化为`false`, 然后开始迭代`['cat', 'dog', 'pig]`, 如果数组中的某个item也就是上述代码中的`value`如果和`cat`相等, 则给acc赋值为`true`并返回, 说明该数组包含`cat`.

**注意:** 别忘记`return acc`!别忘记`return acc`!别忘记`return acc`!

下面使用reduce来解决2个常见的问题: **数组扁平化** 和**数组去重**

### 数组去重

```javascript
var arr = [2,3,2,2,1,5,6];

function deduplicate(arr){
 var obj =  arr.reduce((acc, value)=>{
    acc[value] = value;
    return acc;
  }, {})
  return Object.values(obj)
}
console.log(deduplicate(arr))
```

### 数组扁平化

```javascript
function flatten(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return arr;
  }

  let newArr = [...arr];

  function next() {
    var noDone = newArr.filter(v => Array.isArray(v));
    if (noDone.length === 0) {
      return;
    }

    newArr = newArr.reduce((acc, value) => {
      if (Array.isArray(value)) {
        acc = acc.concat(value);
      } else {
        acc.push(value);
      }
      return acc;
    }, []);
    next();
  }

  next();

  return newArr;
}

console.log(flatten([1, [2, 3, [5, 521, [224, 590]]], 3, 4]));
```

## 深浅拷贝

拷贝考虑的事情: 引用类型的拷贝如何处理, 解引用 

### 浅拷贝 只拷贝一层

```javascript
// ... & Object.assign
const copy = {... {prop: 1}}
Object.assign({}, {prop: 1})

// slice
let arr  = [1, {props:1}]
const copy = arr.slice();
```

### 深拷贝 拷贝多层

```javascript
// JSON.stringify & JSON.parse
var copy = JSON.parse(JSON.stringify(obj))
// 问题: 1. JSON拷贝回丢失信息(function undefined RegExp, Error)
//      2. 循环引用的问题
```

实现深拷贝思路:

- 对于基本类型直接复制
- 对于[] {} 则进行递归拷贝

```javascript
// 实现思路


```
