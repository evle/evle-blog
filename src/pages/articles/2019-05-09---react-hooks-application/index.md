---
title: "React Hooks 原理分析"
date: "2019-05-09"
layout: post
draft: true
path: "/posts/react-hooks-application"
category: "React"
tags:
  - React
description: ""
---

React Hooks虽然普及度还不高, 但是很可能是React以后的开发趋势,


性能优化:1 Object.is
setState会合并状态对象

useState不会 它会替代老对象 不是覆盖同一属性
如果传的是老状态 它旧不渲染组件了

  2.减少渲染的次数

1。 保证number没有变化 则addClick data也不变

子组件+ 一个判断 如果说属性没变则不需要刷新




