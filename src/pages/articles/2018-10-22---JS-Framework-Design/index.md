---
title: "JavaScript Framework Design"
date: "2018-10-22"
layout: post
draft: false
path: "/posts/JS-Framework-Design"
category: ""
tags:
  - JavaScript
description: ""
---

# JavaScript Framework Design

待续

## 写在前面的

待续

## Done something simple

`$`经常被用来在各种语言中使用, 在Web开发中也不例外, 人人都知道的Jquery使用了`$` 提高了我们的效率
make our life better, take a look at a example below:  

首先我们来实现如下第一个功能 **Query Elements**.

```javascript
var div = document.querySelector('div');

var div = $('div')
```

我们要实现的是通过`$`选择元素, 当匹配到一个元素时, 返回匹配到的元素, 当匹配到多个元素时, 返回`NodeList`.

```javascript
$ = function(s){
  var el = document.querySelectorAll(s),
  len = el.length;
  return len === 1 ? el[0] : el;
}
```

现在我们就可以通过`$`来选择元素了，比如

```javascript
var links = $(p:first-child)
```

当选择到多个元素时，它会返回`NodeList`, 那么如果我们想像下面这样通过`forEach`来遍历节点该怎么办呢？

```javascript

```

下面我们来实现 Events 中的事件绑定(Bind events)和自定义事件(Custom events). 通常我们在 Web 开发中使用`addEventListener`绑定事件，比如给所有的`p`元素绑定点击事件:

```javascript
document.querySelectorAll('p').forEach(function(el){
  el.addEventListener('click', function(event){
    event.preventDefault();
    // do something else
  })
})
```

从上面的代码片段我们可以看出 `addEventListener` 太长了, 如何实现像 jQuery那样通过`on`来绑定事件呢？








```javascript
var links = $('')

$ = (function (document, window, $) {
    // Node covers all elements, but also the document objects
    var node = Node.prototype,
        nodeList = NodeList.prototype,
        forEach = 'forEach',
        trigger = 'trigger',
        each = [][forEach],
        // note: createElement requires a string in Firefox
        dummy = document.createElement('i');
  
    nodeList[forEach] = each;
  
    // we have to explicitly add a window.on as it's not included
    // in the Node object.
    window.on = node.on = function (event, fn) {
      this.addEventListener(event, fn, false);
  
      // allow for chaining
      return this;
    };
  
    nodeList.on = function (event, fn) {
      this[forEach](function (el) {
        el.on(event, fn);
      });
      return this;
    };
  
    // we save a few bytes (but none really in compression)
    // by using [trigger] - really it's for consistency in the
    // source code.
    window[trigger] = node[trigger] = function (type, data) {
      // construct an HTML event. This could have
      // been a real custom event
      var event = document.createEvent('HTMLEvents');
      event.initEvent(type, true, true);
      event.data = data || {};
      event.eventName = type;
      event.target = this;
      this.dispatchEvent(event);
      return this;
    };
  
    nodeList[trigger] = function (event) {
      this[forEach](function (el) {
        el[trigger](event);
      });
      return this;
    };
  
  
    // $.on and $.trigger allow for pub/sub type global
    // custom events.
    $.on = node.on.bind(dummy);
    $[trigger] = node[trigger].bind(dummy);
  
    return $;
  })(document, this);
  ```
