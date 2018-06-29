---
title: "Building Scroll Animations for Web and Mobile"
date: "2018-06-29"
layout: post
draft: false
path: "/posts/js-animation"
category: "JavaScript"
tags:
  - JavaScript
  - Animation
description: ""
---

1. Custom/Multiple Containers
The default container is the viewport, but you can assign any container to any reveal set.

> Tip: ScrollReveal works just as well with horizontally scrolling containers too!

```javascript
<div id="fooContainer">
  <div class="foo"> Foo 1 </div>
  <div class="foo"> Foo 2 </div>
  <div class="foo"> Foo 3 </div>
</div>

<div id="barContainer">
  <div class="bar"> Bar 1 </div>
  <div class="bar"> Bar 2 </div>
  <div class="bar"> Bar 3 </div>
</div>
```