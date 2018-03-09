---
title: "回顾CSS float属性"
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
现在再来讨论float属性似乎已经是outdated. 因为现在人们现在为了兼容性和开发效率更多的使用Grid system或者Flexbox布局代替float. 到现在为止对于float人们还有很多争议, 比如到底该如何使用float, 甚至该不该使用float.

## float 起源  
float最原始的目的是为了排版设计而使用的，在排版中我们常见的一种布局就是文字环绕图片(text wrap)像下面这样:
![text-wrap.png](https://s1.ax1x.com/2018/03/09/927wVI.png)
后来float渐渐被用于网页布局中:
![9274I0.png](https://s1.ax1x.com/2018/03/09/9274I0.png)
再后来由于float的自适应性, float的应用更加广泛，被越来越多的应用在一些小部件上或者mobile-first的布局上.
![9277zF.png](https://s1.ax1x.com/2018/03/09/9277zF.png)

## float特性
float有2个特性: `wrap` 和 `collapse`, 如果不理解它们, 在使用float的过程中往往会出现意料之外的结果.

### 包裹性
举一个例子来说明以下包裹性.
`<img>`是一个block元素, 宽度默认是100%
```html
<div style="border:solid 0.5em hotpink">
  <img src="img-1.jpg" alt="" />
</div>
```
[![9RSmHU.md.png](https://s1.ax1x.com/2018/03/09/9RSmHU.md.png)](https://imgchr.com/i/9RSmHU)
但当`<img>`外层的`<div>`设置为浮动的话,`<img>`元素则会被包裹起来,宽度会根据内容自适应,这就是所谓的包裹性
```html
<div style="border:solid 0.5em hotpink;float:left">
  <img src="img-1.jpg" alt="" />
</div>
```
![9RSKN4.png](https://s1.ax1x.com/2018/03/09/9RSKN4.png)

### 高度坍塌
当给`<img>`元素设置float属性时, 外层的`<div>`元素的高度会坍塌.  
```html
<div style="border:solid 0.5em hotpink">
  <img src="img-1.jpg" alt="" style="float:left" />
</div>
```
![92HeFP.png](https://s1.ax1x.com/2018/03/09/92HeFP.png)

## 清除浮动
为什么要清除浮动？因为浮动会带来很多副作用，举一个例子，比如我们想实现下图布局
![9274I0.png](https://s1.ax1x.com/2018/03/09/9274I0.png)
```html
<header style="border:solid 0.5em hotpink">Header</header>
<aside style="border:solid 0.5em yellow; float:left">Sidebar</aside>
<article style="border:solid 0.5em red; float:right">Main Content</article>
<footer style="border:solid 0.5em green">Footer</footer>
```
但是, 我们得到的却是这样的结果:
![9RS0Cd.png](https://s1.ax1x.com/2018/03/09/9RS0Cd.png)
由于浮动产生的影响, Footer元素没有显示它该显示的位置. 接下来设置Footer元素的clear属性来消除浮动带来的影响
```html
<footer style="border:solid 0.5em green;clear:both">Footer</footer>
```
此外，由于包裹性，`aside`和`article`元素没有宽度, 我们还需要为它们设置宽度
```html
<aside style="border:solid 0.5em yellow; float:left;width:25%">Sidebar</aside>
<article style="border:solid 0.5em red; float:right;width:70%">Main Content</article>
```
清除浮动有很多种方法, 但通过`clearfix`class来清除浮动带来的影响是一个相对最佳的解决方案.
`定义clearfix`:
```CSS
.clearfix:after {
  content: "";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
```
修改之前的代码为:
```html
<header style="border:solid 0.5em hotpink">Header</header>
<div class="clearfix">
    <aside style="border:solid 0.5em yellow; float:left">Sidebar</aside>
    <article style="border:solid 0.5em red; float:right">Main Content</article>
</div>
<footer style="border:solid 0.5em green">Footer</footer>
```
![9RpIFe.png](https://s1.ax1x.com/2018/03/09/9RpIFe.png)

## Summary
float存在着很多问题, 在能避免使用float的情况下尽量不用float. 比如在实现下图的布局时, 最好使用`display:inline-block`来代替`float:left`.
![92HMQg.png](https://s1.ax1x.com/2018/03/09/92HMQg.png)

float属性应该应用在实现一些类似文字环绕图片的效果, 如果需要使用float布局应该使用以下三种替代方案：
- Flexbox
- Multi-column Layout
- Grid Layout
