---
title: "逝去的jQuery之构造器之旅"
date: "2019-04-21"
layout: post
draft: false
path: "/posts/jquery-codebase"
category: "JavaScript"
tags:
  - jQuery
  - JavaScript
description: ""
---

jQuery已经逐渐淡出前端开发的视线, 当然并不是说jQuery不重要, 从2006年jQuery的诞生开始就已经改变了Web开发的模式, 开发人员甚至不需要了解 Native JavaScript API 就可以随心所欲的操作DOM, CSS, 甚至实现动画。jQuery简洁的接口调用, 对多浏览器的兼容处理, 以及丰富的插件极大降低了开发难度并且提高了开发效率。Web技术发展至今, 很多jQuery提供给我们的功能已经不再被需要了, 但是理解jQuery的设计原理依然是帮助我们提升编程能力的高效途径之一。

## 被Web标准逐渐替代的jQuery

`$`基本是jQuery的代名词, 简易强大的selector是jQuery留给我们的最初印象, 但它已经完全被新的浏览器API所代替。

```javascript
$('.myClass');

document.querySelector('ul.someList li:last-child');
```

HTML5也提供给我们新特性`classList`来代替使用jQuery操作class

```javascript
$('div').toggleClass('myClass');

var div = document.querySelector('div');
div.classList.toggle('myClass');
```

jQuery同时提供给我们很多便捷遍历数据的方法比如`$.each()`, 这些方法也可以被现代浏览器的API代替

```javascript
['one', 'two', 'three', 'four'].forEach(function(){
  // ...
});
```

以及最最最常用的方法之一:

```javascript
$(document).ready(function() {
    console.log( "ready!" );
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM ready, run it!
}, false);
```

除此之外还有`$.Ajax()`等等, 虽然这不是我们讨论的重点, 但我们需要意识到Web标准在不断的进化, Web Component, Shadow DOM, HTTP3等技术都在不断发展, 作为开发人员我们要有灵敏的嗅觉以及拥抱变化的能力才会对日益复杂的问题提供更好的解决方案。

## jQuery构造器之旅

jQuery使用起来很灵活, 支持多种使用方法, 很多库也都采用了这样的设计比如Axios, 这会降低使用者的开发难度并且使代码更简洁。但同时也要衡量利弊, 一个接口承载的责任越多内部处理会越复杂。

```javascript
$(document)
$('<div>')
$('div')
$('#test')
$(function(){})
...
```

### 无new构建

从上面的代码我们可以看到jQuery在调用时候无需使用new关键字, 那么它是如何实现隔离每一个`$()`操作让每次操作互不影响呢？让我们看下简化过的jQuery构造器的代码。

```javascript
jQuery = function( selector, context ) {
    return new jQuery.fn.init( selector, context );
  }

jQuery.fn = jQuery.prototype;

jQuery.fn = {
    name: function(){return 'max'},
    init: function(selector){
        // handle HTML string
        // handle callback
        // handle selector
        // ...
        console.log(this.name); // max
        return this;
    }
}

jQuery.fn.init.prototype = jQuery.fn;

$ = jQuery
```

这里要注意的有两点:

1. 为什么不直接返回new jQuery() 而是要new jQuery.prototype.init?
2. jQuery.prototype.init中如何访问到this.name?

new是为了让每个jQuery实例都是独立的, 但显而易见如果直接返回`new jQuery`会造成死循环, 所以jQuery将返回`new jQuery.prototype.init()`, 这时init中的this指向当前这个对象达到了我们无new实现构造函数的目的。

那么来看第二点, 由于我们构造器返回的是`init`这个对象, `init`中自然没有`name`,我们无法通过`this.name`来得到`max`并会得到错误*VM7337:1 Uncaught TypeError: $(...).name is not a function*, 所以解决方法就是`jQuery.fn.init.prototype = jQuery.fn`, 让`jQuery.fn.init.prototype`指向jQuery的`prototype`, 这样就可以在`init`内部通过`this.name`访问到`max`了。

### 构造器类型

通过阅读官方API文档我们可以看到jQuery的构造器接受以下这三类参数的传入:

- jQuery( selector [, context ] )
- jQuery( html [, ownerDocument ] )
- jQuery( callback )

下面让我们分别举3个例子来说明一下这3类参数在jQuery内容是如何处理的。

### 例子1: jQuery( selector [, context ] )

先从第一个简单的例子开始, 下面jQuery代码寻找到id为`area`的div并且在里面添加文本`hello world`。

```html
<div id="area"></div>

<script>
    $('#area').text('hello world')
</script>
```

首先`$(#area)`会调用jQuery的构造器函数`jQuery.fn.init(selector, context)`在这个函数中先判断我们传递的`#area`是否为空

```javascript
if ( !selector ) return this;
```

然后再判断`#area`是不是字符串, 如果是字符串的话就判断有没有左右尖括号来确定它是不是HTML标签, 如果不是HTML标签那传入的就是id了, 使用`document.getElementById(id)`获取到DOM节点后把它注入到jQuery对象中, 代码如下:

```javascript
if ( typeof selector === "string" ) {
  if ( selector[ 0 ] === "<" &&
      selector[ selector.length - 1 ] === ">" &&
      selector.length >= 3 ) {
      ...
  }else {
    elem = document.getElementById( match[ 2 ] );
      if ( elem ) {
        this[ 0 ] = elem;
        this.length = 1;
      }
    return this;
  }
```

`$()`构造器最终回返回一个jQuery对象, `jQuery通过`jQuery.fn.extend`为jQuery添加了很多静态方法, 比如下面这个`text`方法。

```javascript
jQuery.fn.extend( {
    // other method
    text: function( value ) {
        return access( this, function( value ) {
            return value === undefined ?
                jQuery.text( this ) :
                this.empty().each( function() {
                    if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                        this.textContent = value;
                    }
                } );
        }, null, value, arguments.length );
    },
})
```

`text`方法调用了`access`方法为指定的DOM节点设置文本内容, `access`接受了3个重要的参数: 要设置文本内容的DOM节点this, 以及一个设置值的回调函数和要被设置成的值`value`也就是`hello world`。

```javascript
 access = function( elems, fn, key, value, ...){
   // ...
    fn.call( elems, value );
    fn = null;
  // ...
    return elems;
  // ...
 }
```

最终通过调用回调函数`fn`设置了该节点文本的内容

```javascript
  if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
      this.textContent = value;
  }
```

## 例子2: jQuery( html [, ownerDocument ] )

```javascript
$('<div>content</div>').appendTo(document.body);
```

上面的代码是2个过程, 先生成一个`<div>content</div>`并注入到jQuery对象中,第二个过程是把这个jQuery对象添加到`document.body`中。下面让我们详细的分析一下, 在构造器中先判断传入的参数是否是字符串, 如果是则通过判断尖括号来识别是不是一个HTML标签, 如果是的话则开始构建HTML标签的过程：

`jQuery.parseHTML()` -> `buildFragment()` -> `createDocumentFragment()` -> `createElement('div')`

这里是创建了一个tmp是临时的`div`标签, 通过`tmp.innerHTML = "<div>content</div>"`形成了这样的结构

```javascript
<div>
  <div>content</div>
</div>
```

然后又通过jQuery的`merge`方法将`<div>content</div>`放到nodes一个空数组中: `jQuery.merge( nodes, tmp.childNodes )`。
最后又把数组中的div追加到fragment中。

```javascript
i = 0;
elem = nodes[ i++ ]
fragment.appendChild( elem )
```

最后return这个对象并合并到jQuery对象中。接下来就是要将这个fragment节点追加到body中, 先通过`jQuery(body)`将body转换成一个jQuery对象, 然后通过`jQuery( body: jQuery Object )[ 'append' ]( div: jQuery Object );`, 把fragment节点加到body中称为一个真实的DOM节点。

## 例子3: jQuery( callback )

```javascript
$(function(){
  console.log('dom ready')
})
```

我们传入的函数会在DOM节点加载完成的时候触发, jQuery构造器会判断上面我们传入的参数是否是一个函数, 如果是的话则调用`jQuery.ready(fn)`

```javascript
// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

  readyList
    .then( fn )
    .catch( function( error ) {
      jQuery.readyException( error );
    } );

  return this;
};
```

这里涉及到`Deferred`对象, 它是jQuery根据Pormise／A标准实现的一种异步方案, 我们在这里不做讨论, 只分析下我们注册回调到被调用的过程。首先在jQuery在初始化的时候会注册一个`DOMContentLoaded`事件: `document.addEventListener( "DOMContentLoaded", completed );`, 当DOM加载完毕后回调`completed`方法, 并在`completed`中调用`jQuery.ready()`方法。`jQuery.ready()`会使用`readyList.resolveWith`通知并运行我们之前注册的回调函数`function(){ console.log('dom ready')}`。

## 总结

本篇仅仅对jQuery的构造器行了简单的分析, 但jQuery还提供给我们很多功能比如:

- DOM 操作、遍历
- 操作CSS
- 异步请求
- 动画
- 事件

这些功能都是一个JavaScript程序员必备的基础, 大家可以自行通过阅读这些功能所涉及的源码来梳理, 巩固一遍浏览器API, 所谓温故而知新。