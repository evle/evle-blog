---
title: '理解 MVVM 框架'
date: '2019-04-27'
layout: post
draft: false
path: '/posts/mvvm-framework'
category: 'JavaScript'
tags:
  - JavaScript
description: ''
---

## 理解 MVVM

Web 开发的终极难题之一就是如何降低大型系统的复杂度, 因此衍生出了很多 MV\*架构模式来降低应用开发的复杂度, 使应用更易于测试, 维护, 协作。

MV\*架构的原则是通过**分层**来改进代码的组织方式, 先从最经典的 MVC 架构说起, MVC 的基本模型是一个单向通信如下:

1. 用户与 View 交互: View 传送指令到 Controller
2. Controller 完成业务逻辑后， 要求 Model 改变状态
3. Model 更新数据并且通知 View， 用户得到反馈

从整个流程来看 V 与 M 是有交互的, 因此衍生了 MVP 架构来进一步进行解耦使 V 与 M 分离, 使用 Presenter 层来充当一个中间人角色,以一个点击自增的按钮示例, 没当点击一次按钮就会出现递增数字

<div style="margin: 1rem 2rem 1rem 2rem">
<button>count: 0</button>
</div>

```javascript
class Model {
  constructor() {
    this.value = 0
  }
  add() {
    console.log(this.value)
    this.value++
  }
  get() {
    return this.value
  }
}

class Presenter {
  constructor(view) {
    this.view = view
    this.model = new Model()
  }

  increment = () => {
    this.model.add()
    this.view.textContent = `Count: ${this.model.get()}`
  }
}

class View {
  constructor() {
    this.btn = document.querySelector('button')
    this.presenter = new Presenter(this.btn)
    this._bindEvent()
    this.btn.textContent = 'Count: 0'
  }
  _bindEvent() {
    this.btn.addEventListener('click', this.presenter.increment.bind(this))
  }
}
new View()
```

MVVM 和上面的 MVP 架构唯一的区别在于: MVVM 采用 Two-way Data Binding, View 有变动的时候,Viewmodel 会响应, 反之亦然。

## MVVM 框架实现关键

![ED9Eh4.png](https://s2.ax1x.com/2019/05/06/ED9Eh4.png)

在传统 MVC 架构中我们可以通过使用  发布订阅模式来对数据和视图绑定监听函数, 但是现代浏览器提供给来我们更便捷的实现 API 比如`Proxy`和`Object.defineProperty`。 在现代框架中实现 MVVM 框架需要实现以下部分: 模板编译(Compile), 数据劫持(Observer), 发布的订阅(Dep), 观察者(Watcher), MVVM 模式就是将这些部分组合在一起, 下面就让我们参照 Vue 的使用方式实现一个 MVVM 框架。

![EDPASJ.png](https://s2.ax1x.com/2019/05/06/EDPASJ.png)

```javascript
<div id="app">
    <input type="text" v-model="message.a">
    {{message.a}} {{b}}
</div>
<script src="watcher.js"></script>
<script src="observer.js"></script>
<script src="compile.js"></script>
<script src="MVVM.JS"></script>
<script>
    let vm = new MVVM({
        el:'#app',
        data:{
            message:{a:'jw'},
            b:'MVVM'
        }
    })
</script>

```

首先先实现 MVVM 这个类, 这个类的目的是将数据挂载在 DOM 节点上, 将传入的节点和数据交给`Compile`来生成视图。

```javascript
class MVVM {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    if (this.$el) {
      new Compile(this.$el, this)
    }
  }
}
```

```javascript
class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    if (this.el) {
      // 1.先把这些真实的DOM移入到内存中 fragment (性能优化)
      let fragment = document.createDocumentFragment()
      let firstChild
      while ((firstChild = el.firstChild)) {
        fragment.appendChild(firstChild) // appendChild具有移动性
      }

      // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
      this.compile(fragment)



      // 3.把编译号的fragment在塞回到页面里去
      this.el.appendChild(fragment)



      
    }
  }
  /* 核心的方法 */
  compileElement(node) {}
  compileText(node) {}
  compile(fragment) {}
  node2fragment(el) {}
}
```

## 总结

掌握设计模式能让我们站工程化的角度去更细腻的考虑软件的质量, MVVM 模式作为现在的主流框架模式值得我们去探索, 去理解降低软件复杂度的思想。最后让我们回顾一下整个交互的过程:
![EDivV0.png](https://s2.ax1x.com/2019/05/06/EDivV0.png)
