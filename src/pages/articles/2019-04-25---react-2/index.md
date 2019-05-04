---
title: '面向求职编程之理解React第二天'
date: '2019-04-25'
layout: post
draft: true
path: '/posts/react-2'
category: ''
tags:
  - JavaScript
  - React
description: ''
---

## React Virtual DOM Diff

React 核心之一就是 Virtual DOM 如图:

[![EGPi1e.md.png](https://s2.ax1x.com/2019/04/30/EGPi1e.md.png)](https://imgchr.com/i/EGPi1e)

Virtual DOM Diff 指计算 DOM 节点差异部分的一个算法, 为了计算速度它只遍历每一个深度的父节点如图

[![EGPPpD.png](https://s2.ax1x.com/2019/04/30/EGPPpD.png)](https://imgchr.com/i/EGPPpD)

Virtual DOM Diff 的实现有以下三步:

- 用 JS 描述真实 DOM 节点并生成 Virtual DOM(JavaScript Object)
- 遍历比较修改过的 Virtual DOM 和旧 Virtual DOM 节点找出差异部分(非完全遍历)
- 渲染有变化的部分

```javascript
function dfs(oldNode, newNode, index, patches) {
  let currentPatch = [] //当前层的差异对比
  // 节点不存在
  if (!newNode) {
    // 判断是否是文本
  } else if (isTxt(oldNode) && isTxt(newNode)) {
    if (newNode !== oldNode)
      currentPatch.push({ type: 'text', content: newNode })
    //如果发现文本不同，currentPatch会记录一个差异
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    //如果发现两个节点一样 则去判断节点是属性是否一样，并记录下来
    let attrsPatches = diffAttrs(oldNode, newNode)
    if (attrsPatches) {
      //有属性差异则把差异记录下来
      currentPatch.push({ type: 'attrs', attrs: attrsPatches })
    }
    // 递归遍历子节点，并对子节点进行diff比较
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    //最后一种情况是，两个节点完全不一样，这样只需要把旧节点之间替换就行
    //把当前差异记录下来
    currentPatch.push({ type: 'replace', node: newNode })
  }

  //如果有差异则记录到当前层去
  if (currentPatch.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(currentPatch)
    } else {
      patches[index] = currentPatch
    }
  }
}
```

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

3. React Fiber 的目标是提高其在动画、布局和手势等领域的适用性。它的主要特性是 incremental rendering: 将渲染任务拆分为小的任务块并将任务分配到多个帧上的能力

4. Reconciliation 指当组件的 props 或者 state 发生变化, 是否需要更新

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

#### 如何使用动态属性名设置 state

```javascript
handleInputChange(event) {
  this.setState({ [event.target.id]: event.target.value })
}
```

#### 在 React 中什么是 Portal ?

```javascript
// Portal 提供了一种很好的将子节点渲染到父组件以外的 DOM 节点的方式。

ReactDOM.createPortal(child, container)
```

#### React 中启用生产模式

你应该使用 Webpack 的 DefinePlugin 方法将 NODE_ENV 设置为 production

#### 生命周期方法 getDerivedStateFromProps() 的目的

新的静态 getDerivedStateFromProps() 生命周期方法在实例化组件之后以及重新渲染组件之前调用。它可以返回一个对象用于更新状态，或者返回 null 指示新的属性不需要任何状态更新。

```javascript
// mounting顺序
constructor()
static getDerivedStateFromProps()
render()
componentDidMount()
```

#### getSnapshotBeforeUpdate() 的目的

新的 getSnapshotBeforeUpdate() 生命周期方法在 DOM 更新之前被调用。此方法的返回值将作为第三个参数传递给 componentDidUpdate()。

#### 不调用 setState 方法的情况下，强制组件重新渲染

```javascript
component.forceUpdate(callback)
```

#### 如何在调整浏览器大小时重新渲染视图?

你可以在 componentDidMount() 中监听 resize 事件，然后更新尺寸（width 和 height）。你应该在 componentWillUnmount() 方法中移除监听。

#### setState() 和 replaceState() 方法之间有什么区别?

setState 相当于 merge, replaceState 就是 replace

#### React 状态中删除数组元素的推荐方法

```javascript
removeItem(index) {
  this.setState({
    data: this.state.data.filter((item, i) => i !== index)
  })
}
```

#### 不在页面上渲染内容

```javascript
render(){
  return false // null []
}
```

#### 更新状态中的对象

```javascript
const user = { ...this.state.user, age: 42 }
this.setState({ user })
```

#### 在 React 中如何定义常量

```javascript
class MyComponent extends React.Component {
  static DEFAULT_PAGINATION = 10
}
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

#### 重用事件处理

```javascript
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      foo: '',
      bar: '',
    }
  }

  // Reusable for all inputs
  onChange = e => {
    const {
      target: { value, name },
    } = e

    // name will be the state name
    this.setState({
      [name]: value,
    })
  }

  render() {
    return (
      <div>
        <input name="foo" onChange={this.onChange} />
        <input name="bar" onChange={this.onChange} />
      </div>
    )
  }
}
```

### Jest

Jest 是快照测试工具, 这些测试会生成一份渲染好的组件的快照，并在作和未来的快照的比,快照测试可以非 常好地和单元测试互补。

### Enzyme

Enzyme 是一个由 Airbnb 维护的测试工具，可以用来断言、操作、遍历 React 组件。用来管理单元测试，在 React 测试中与快照测试互补。

### Lodash

结合 Lodash 和 three shaking 可以快速开发并且不会影响应用性能

### ESlint 的 Auto Fix On Save

```json
"devDependencies": {

 "eslint-config-airbnb": "^17.1.0",

 "eslint-config-prettier": "^3.1.0",

 "eslint-plugin-import": "^2.14.0",

 "eslint-plugin-jsx-a11y": "^6.1.1",

 "eslint-plugin-prettier": "^3.0.0",

 "eslint-plugin-react": "^7.11.0"

}
```

### React Hook

React Hook 解决了什么问题: 提高复用 & 简化 React

- 所有组件都是 Function
- 不需要 this
- 不需要关心生命周期函数

React 推荐使用`Render Props`和`HOC`来解决复用组件
