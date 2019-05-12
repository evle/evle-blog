---
title: "CSS基本概念之BFC"
date: "2019-05-11"
layout: post
draft: true
path: "/posts/BFC-BEM-CSS"
category: "CSS"
tags:
  - CSS
description: ""
---

> 理论和概念是实践的基石

## 什么是BFC？

BFC的全称是Block Formatting Contexts, 可以理解为是Block文档流, 普通文档流(normal flow)的特性我们都知道即块级元素占一行, 内联元素水平排列占满一行则换行。 那么Block文档流也有自己的特性:

- 属于同一个BFC内的两个相邻元素的`margin`会重叠
- BFC区域与float区域不重叠
- BFC内元素不会影响到外界元素
- BFC计算高度, 浮动元素也参与计算

那如何创建一个BFC呢？可以使用以下方式

- 设置为root元素 `display: flow-root;`
- float不为none
- overflow不为vivisible
- dipaly为inline-block, table-cell, table-caption
- position为absolute或者fixe

## BFC的应用

1. 避免margin重叠

BFC特性之一就是: 2个相邻元素margin会重叠, 比如上面的box：margin-bottom: 100px;下面的box：margin-top: 100px; 