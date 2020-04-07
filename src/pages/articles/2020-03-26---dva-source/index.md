---
title: "dva的核心原理实现"
date: "2020-03-26"
layout: post
draft: true
path: "/posts/dva-source"
category: "react"
tags:
  - 
description: ""
---

dva是对react全家桶的一个轻量级封装, 提升了开发效率

```javascript
// 通过dva() 生成一个全局唯一的app
let app = dva();

// 定义一个model, 用来局部管理状态
app.model({
  namespace:'counter1',
  state:{number:1},
  reducers:{
    add(state){
      return {state.number + 1}
    },
    minus(state){
      return {state.number - 1}
    }
  },
  effects:{
    * asyncAdd(action, {put, call}){
      yield call(delay, 1000);
      yield put({type: 'counter1/add})
    }
  }
})

// react-router-dom
app.route

// 挂载
app.start(root)

```