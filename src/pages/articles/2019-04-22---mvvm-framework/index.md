---
title: 'MVVM 框架浅析'
date: '2019-04-27'
layout: post
draft: true
path: '/posts/mvvm-framework'
category: 'JavaScript'
tags:
  - JavaScript
description: ''
---

模板编译(Compile)
数据劫持(Observer)
发布的订阅(Dep)
观察者(Watcher)

数据就是简单的 javascript 对象,需要将数据绑定到模板上
监听视图的变化,视图变化后通知数据更新,数据更新会再次导致视图的变化！

1. 异步如果控制顺序 放个 array

if array = task.length
console.log()

arr.push(data)

paralle 保证顺序
传入 index if(++i==2) console.log(arr)

series
