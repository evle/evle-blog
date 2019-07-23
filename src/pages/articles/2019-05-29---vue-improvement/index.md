---
title: "vue improvement"
date: "2019-05-29"
layout: post
draft: false
path: "/posts/vue-improvement"
category: ""
tags:
  - 
description: ""
---

Vue单文件组件
条件渲染 循环渲染
样式 和class渲染
组件
事件绑定
监听器
计算属性

组件通信7种
1. 父-》子   props :title="title"
2. 子-》父   $emit() 触发
3. 兄弟组件 父元素搭桥
4. 祖先后代 provide & inject
   element也使用

provide:{
  name: 'evle'
}

子
inject:['title']
{{title}}

5. dispatch
6. boadrcase

7.event bus


怎么设计一个组件库
