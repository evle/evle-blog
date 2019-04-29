---
title: '面向求职编程之理解React第二天'
date: '2019-04-25'
layout: post
draft: false
path: '/posts/react-2'
category: ''
tags:
  - JavaScript
  - React
description: ''
---

## 对 React 的一些理解

1. React 并不是一个 SPA 框架, 而是一个视图库, 也就是 MVC 中的 V, 它的功能仅仅把组件渲染成浏览器中的可见元素。它的思路是: 应用的视图应该是一系列层次分明的可组合的组件

2. JSX 是给 React.createElement() 函数提供语法糖

```javascript
;<div>
  <h1>{'Welcome to React world!'}</h1>
</div>

React.createElement(
  'div',
  null,
  React.createElement('h1', null, 'Welcome to React world!')
)
```

3. React 组件和 React 元素

React 元素返回一个对象(React.createElement), 通过 ReactDOM.render()渲染到 DOM  
React 组件有不同声明方式

4. SyntheticEvent

对浏览器原生事件的跨浏览器包装。它的 API 与浏览器的原生事件相同，包括 stopPropagation() 和 preventDefault()，除了事件在所有浏览器中的工作方式相同

5.

### React 解决了什么问题

前端开发要考虑的问题: 组件化, 模块化, 性能, 维护性

## 对 React 原理的理解

### Virtual DOM Diff

## 对 React 的一些实践

### SSR

原理：将 virtual dom 在服务器端渲染成字符串

方法：
服务端渲染：renderToString、renderToStaticMarkup——>string
客户端渲染：render——>HTML 结构

renderToString 和 renderToStaticMarkup 的区别:

- renderToString: 带有 data-reactid 属性, 客户端的 render 不会重新渲染，只会执行组件 componetDidmout 中的业务，以及绑定事件等等
- renderToStaticMarkup: 不带 data-reactid, 不管服务端有没有渲染，在客户端中都会重新渲染该组件

hydrate:
hydrate 方法，解决的是如何复用 server 端，ReactDOMServer 的结果。

stream:

- renderToNodeStream
- renderToStaticNodeStream

### 长列表优化

场景: 1000 个 DOM 包含 img

原理: 用数组保存所有列表元素的位置，只渲染可视区内的列表元素，当可视区滚动时，根据滚动的 offset 大小以及所有列表元素的位置，计算在可视区应该渲染哪些元素。

成熟解决方案: react-virtualized

### 性能、可读性、简洁的书写

#### Dismiss Button

```javascript
onDismiss(id, event) {
  event.preventDefault();
  const isNotId = item => item.objectID !== id;
  const updatedList = this.state.list.filter(isNotId); this.setState({ list: updatedList });
}
```

#### 在 constructor 中绑定 this

```javascript
constructor() {
  super();
  this.doSomething = this.doSomething.bind(this);
}

doSomething() {
    // do something
}
```

#### Button 传递值给 handler

```javascript
<button
  type="button"
  onClick={()=>{this.handleButton({name: 'evle})}}
>
```

#### 实现过滤

```javascript
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

 {this.state.list.filter(isSearched(this.state.searchTerm)).map(item =>
... )}
```

#### 解构

```javascript
const { searchTerm, list } = this.state

this.setState({
  result: { ...this.state.result, hits: updatedHits },
})
```

#### 条件判断

```javascript
{
  result && <Table list={result.hits} onDismiss={this.onDismiss} />
}
```

#### 缓存请求内容

比如用户发起搜索请求, 第一次搜 react, 第二次搜 redux, 第三次搜 react, 那么需要缓存对象结果这些结果对象将会与搜索词映射成一个键值对。而每一个从 API 得到的结果会以搜索词为键(key)保存下来

```javascript
  results: {
    redux: {
      hits: [ ... ],
      page: 2, },
    react: {
      hits: [ ... ],
      page: 1,
},
... }

 this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
 })
```

#### 错误处理

```javascript
this.state = { error: null }
fetch(url)
  .then(e)
  .catch(e => this.setState({ error: e }))

{
  error ? (
    <div className="interactions">
      <p>Something went wrong.</p>
    </div>
  ) : (
    <Table list={list} onDismiss={this.onDismiss} />
  )
}
```

### React Router

### React AntD

### Jest

Jest 是快照测试工具, 这些测试会生成一份渲染好的组件的快照，并在作和未来的快照的比,快照测试可以非 常好地和单元测试互补。

### Enzyme

Enzyme 是一个由 Airbnb 维护的测试工具，可以用来断言、操作、遍历 React 组件。用来管理单元测试，在 React 测试中与快照测试互补。

### Lodash

结合 Lodash 和 three shaking 可以快速开发并且不会影响应用性能
