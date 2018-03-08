---
title: "详解float属性"
date: "2018-03-09"
layout: post
draft: false
path: "/posts/float-character"
category: "CSS"
tags:
  - css
  - float
description: ""
---
以前网上关于float的讨论特别多, 它是实现自适应的主流布局，很多文章都在介绍float的奇淫巧技术. 但时代不同了，现在人们现在布局为了兼容性和开发效率更多的使用grid system或者Flexbox布局. float最原始的目的也就是为了排版设计的，在排版中我们常见的一种布局就是文字环绕图片(text wrap)像下面这样:
![text-wrap.png](https://s1.ax1x.com/2018/03/09/927wVI.png)
后来float渐渐被用于网页布局中:
![9274I0.png](https://s1.ax1x.com/2018/03/09/9274I0.png)
后来由于float的自适应性float被越来越多的应用在一些小部件上:
![9277zF.png](https://s1.ax1x.com/2018/03/09/9277zF.png)

float有2个特性有以下2个特性, 如果不掌握它们, 在使用float的过程中往往会出现意料之外的结果.
- Wrap
- Collapse

## 包裹性
<img>是一个block元素, 宽度默认是100%, 但当<img>外层的div设置为浮动的话,<img>标签则会被包裹起来,宽度会根据内容自适应,这就是所谓的包裹性，为了不让外层div包裹内层元素通常我们需要给浮动元素设置宽度.

## 高度坍塌
当父级元素包含float元素时, 它的高度会坍塌.
![92HeFP.png](https://s1.ax1x.com/2018/03/09/92HeFP.png)

## 清除浮动
了解了float的两个特性后, 在使用float的过程中,我们通常会使用清除浮动来解决float带来的副作用. 最常用的清除浮动的方法是 `clear:both`, 我们可以通过给指定的元素添加`clearfix`class来清除浮动
```CSS
.clearfix:after {
  content: "";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
```


## Summary
float存在着很多问题, 使用浮动最好的方式就是做一些例如文字环绕图片的效果，不要使用float排版一个水平列表
![92HMQg.png](https://s1.ax1x.com/2018/03/09/92HMQg.png)
而是要把float-left属性改为`display:inline-block`.
如果使用float进行布局，则最好使用以下3种替代方案：
- Flexbox
- Multi-column Layout
- Grid Layout
