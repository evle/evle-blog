---
title: "Flexbox Layout"
date: "2018-03-27"
layout: post
draft: false
path: "/posts/Flexbox-Layout"
category: ""
tags:
  -
description: ""
---
未完成 待更新
Flexbox Layout提供给前端开发者一种高效的布局方式，flex布局的主要思想是:
> Give the container the ability to alter its item's width/height(and order) to best fill the available space.

它适合绝大多数Web APP的布局和小规模布局，而 Grid Layout适合大规模的布局，比如像大型的新闻咨讯网站.

## Terminology
Flex Layout有2个核心的概念:
- Container: properties for the parent(flex container)
- Items: properties for the children(flex item)
flex布局的使用方法就是设置container(指定container里的元素如何排列),然后设置items(指定items在container中国年如何排列)

### Container设置
#### display
在使用flex布局之前，首先要通过给container设置display属性为`flex`或`inline-flex`
```html
.container {
  display: flex; /* or inline-flex */
```

#### flex-direction
通过给container设置flex-direction, 可以指定container里面items的排列方式, 默认是横向排列
```html
.container{
  flex-direction: row | row-reverse | column | column-reverse
}
```

#### flex-wrap
在默认情况下，flex item会尽量排列成一行, 当item过多并在一行排列不下的情况时, item会收缩自己的
宽度强行排列成一行, 这可能会导致元素的显示出现问题. flex-wrap的作用就是将item包裹起来，当item
在一行排列不下时，会自动换行
```html
.container{
  flex-wrap: nowrap | wrap| wrap-reverse  /* default: nowrap */
}
```

#### flex-flow
`flex-flow`可以一次性设置`flex-direction`和`flex-wrap`.
```html
flex-flow: <flex-direction> <flex-wrap>   /* Default: row nowrap */
```

#### justify-content
给container设置`justify-content`属性可以指定container中item在水平方向的排列方式，是靠左还是靠右，
是靠中间还是其它。
```html
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;  /* Default: flex-start */
}
```

#### align-content
`align-content`属性和`justify-content`属性类似，但是指定了items在垂直方向的排列方式.
```html
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
  /* Default: stretch */
}
```

#### align-items
给container设置`align-items`属性可以指定container中item（在单行item的情况下)在垂直方向的排列方式，是靠上、下、还是
中还是其它。
```html
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
  /* Default: stretch */
}
```
`stretch`属性会拉伸item元素，使其和container高度相同


### Item设置
#### flex-grow
`flex-grow`可以让flex item按照指定的值生长。e.g. 有4个item, 给每个item设置`flex-grow: 1`
然后给其中一个item设`flex-grow: 2`，这个item就会占有更多的空间, 其它item会被挤压.
```html
  flex-grow: <number>   /* Default: 0*/
```
#### flex-shrink
和`flex-grow`属性相反

#### flex-basis
设置flex item的宽度, 当items的宽度加起来大于container的宽度，则items会被压缩填充进container.
反之则items会被拉伸填充container.
```html
.item{
  flex-basis: 25px
}
```

#### flex
最常用的属性, 一次可以设置`flex-grow`, `flex-shrink` 和 `flex-basis`3个属性
```html
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
  /* Default: 0 1 auto */
}
```

#### align-self
设置flex items在垂直方向的排列方式.
```html
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

#### order
通过给items设置order属性，可以改变items的排列顺序, 默认为`order: 0`
```html
.item{
    order: 1; /* -1 */
}
```

## Example
### 基础水平方向排列:
```html
.parent {
  display: flex;
  height: 300px;
}

.child {
  width: 100px;  
  height: 100px;
  margin: auto;
}
```
该布局最关键的一点就是`margin: auto`，让item可以完美的在水平方向排列 查看[example-1](#)
### 自适应水平方向排列
```html
.container{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}
```
当缩放屏幕时item会自适应排列 查看[example-2](example)

### 导航条
```html
.navigation {
  display: flex;
  flex-flow: row wrap;
  /* This aligns items to the end line on main-axis */
  justify-content: flex-end;
}

/* Medium screens */
@media all and (max-width: 800px) {
  .navigation {
    /* When on medium sized screens, we center it by evenly distributing empty space around items */
    justify-content: space-around;
  }
}

/* Small screens */
@media all and (max-width: 500px) {
  .navigation {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }
}
```
本示例展示了flex与`@media`结合实现自适应布局 查看[example-3](#)

### 自适应Blog布局
```html
.wrapper {
  display: flex;
  flex-flow: row wrap;
}

/* We tell all items to be 100% width, via flex-basis */
.wrapper > * {
  flex: 1 100%;
}

@media all and (min-width: 600px) {
  /* We tell both sidebars to share a row */
  .aside { flex: 1 auto; }
}

@media all and (min-width: 800px) {
  /* We invert order of first sidebar and main
   * And tell the main element to take twice as much width as the other two sidebars
   */
  .main { flex: 2 0px; }
  .aside-1 { order: 1; }
  .main    { order: 2; }
  .aside-2 { order: 3; }
  .footer  { order: 4; }
}
```
查看[example](#)

### 左中右

.box {
  display: flex;
}

.item:nth-child(2) {
  align-self: center;
}

.item:nth-child(3) {
  align-self: flex-end;
}


.box {
  display: flex;
  flex-wrap: wrap;
}

.row{
  flex-basis: 100%;
  display:flex;
}

.row:nth-child(2){
  justify-content: center;
}

.row:nth-child(3){
  justify-content: space-between;
}<div class="box">
  <div class="row">
    <span class="item"></span>
    <span class="item"></span>
    <span class="item"></span>
  </div>
  <div class="row">
    <span class="item"></span>
  </div>
  <div class="row">
     <span class="item"></span>
     <span class="item"></span>
  </div>
</div>


### FLex Grid
<div class="Grid">
  <div class="Grid-cell">...</div>
  <div class="Grid-cell">...</div>
  <div class="Grid-cell">...</div>
</div>



<body class="HolyGrail">
  <header>...</header>
  <div class="HolyGrail-body">
    <main class="HolyGrail-content">...</main>
    <nav class="HolyGrail-nav">...</nav>
    <aside class="HolyGrail-ads">...</aside>
  </div>
  <footer>...</footer>
</body>

.HolyGrail {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

header,
footer {
  flex: 1;
}

.HolyGrail-body {
  display: flex;
  flex: 1;
}

.HolyGrail-content {
  flex: 1;
}

.HolyGrail-nav, .HolyGrail-ads {
  /* 两个边栏的宽度设为12em */
  flex: 0 0 12em;
}

.HolyGrail-nav {
  /* 导航放到最左边 */
  order: -1;
}

@media (max-width: 768px) {
  .HolyGrail-body {
    flex-direction: column;
    flex: 1;
  }
  .HolyGrail-nav,
  .HolyGrail-ads,
  .HolyGrail-content {
    flex: auto;
  }
}

输入框
<div class="InputAddOn">
  <span class="InputAddOn-item">...</span>
  <input class="InputAddOn-field">
  <button class="InputAddOn-item">...</button>
</div>


.InputAddOn {
  display: flex;
}

.InputAddOn-field {
  flex: 1;
}


有时，主栏的左侧或右侧，需要添加一个图片栏。
<div class="Media">
  <img class="Media-figure" src="" alt="">
  <p class="Media-body">...</p>
</div>

.Media {
  display: flex;
  align-items: flex-start;
}

.Media-figure {
  margin-right: 1em;
}

.Media-body {
  flex: 1;
}

固定地兰
有时，页面内容太少，无法占满一屏的高度，底栏就会抬高到页面的中间。这时可以采用Flex布局，让底栏总是出现在页面的底部。

<body class="Site">
  <header>...</header>
  <main class="Site-content">...</main>
  <footer>...</footer>
</body>


.Site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.Site-content {
  flex: 1;
}



720分辨率（大于480px，小于767px）

@media only screen and (min-width: 480px) and (max-width: 767px){
    #page{ width: 450px; }#content,.div1{width: 420px;position: relative; }#secondary{display:none}#access{width: 450px; }#access a {padding-right:5px}#access a img{display:none}#rss{display:none}#branding #s{display:none}
}
