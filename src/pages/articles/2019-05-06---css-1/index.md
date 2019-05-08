---
title: 'css 1'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/css-1'
category: 'CSS'
tags:
  - CSS
description: ''
---

CSS 中背景图片的 URL 问题：
当前层级为 CSS 文件所在的这层，因此在引入图片的时候 需要 ../img/someone.png

响应式设计 full responsive 问题：
当前项目在缩放屏幕到 break point 的过程中，样式会出现问题，在设计响应式的屏幕尺寸时，要明确屏幕尺寸
Default { Mobile phone}
@media (min-width: 576px) { Tablet }
@media (min-width: 768px) { Laptop }
@media (min-width: 992px) { Computer }
@media (min-width: 1200px) { Large screen device }

背景居中不重复
background: url(public/img/status.png) no-repeat center center;

如何裁剪图片
width: 280px;
object-fit: cover;
height: 280px;

textarea
去除小三角：resize:none;
去除黄色的框：outline:none;

overflow 实现高度自适应
父设置 overflow: hidden, 不设置高度
