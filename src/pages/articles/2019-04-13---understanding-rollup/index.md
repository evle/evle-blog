---
title: "kj"
date: "2019-04-13"
layout: post
draft: true
path: "/posts/understanding-rollup"
category: ""
tags:
  - 
description: ""
---

创建模块 

```javascript
export default ()=> 'Module A'
export default ()=> 'Module B'
```

项目中的每个模块 rollup都会使用它的loader创建module
在这个过程中有有2个关键过程

- 解析
对代码的解析使用了 Acron， 使用Acron会解析称一个module 并且初始化这个module相关的东西

- 分析 Analysis
解析成module之后的下一步就是分析了, 首先开始遍历Ast并且给每个节点设置`parent` `module` 
`keys`

parent

module

keys


初始化节点


