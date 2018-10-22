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

## 写在前面的


## Done something simple
`$`经常被用来在各种语言中使用, 在Web开发中也不例外, 人人都知道的Jquery使用了`$` 提高了我们的效率
make our life better, take a look at a example below: 
```javascript
var div = document.querySelector('div');

var div = $('div')
```
我们接下来实现这个功能
```javascript
$ = function(s){
	var el = document.querySelectorAll(s),
		len = el.length;
	return len === 1 ? el[0] : el;
}
```


## Query elements
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
  
    $ = function (s) {
      // querySelectorAll requires a string with a length
      // otherwise it throws an exception
      var r = document.querySelectorAll(s || 'â˜º'),
          length = r.length;
      // if we have a single element, just return that.
      // if there's no matched elements, return a nodeList to chain from
      // else return the NodeList collection from qSA
      return length == 1 ? r[0] : r;
    };
  
    // $.on and $.trigger allow for pub/sub type global
    // custom events.
    $.on = node.on.bind(dummy);
    $[trigger] = node[trigger].bind(dummy);
  
    return $;
  })(document, this);
