---
title: '面向求职编程之重刷React'
date: '2019-04-23'
layout: post
draft: false
path: '/posts/react-1'
category: 'React'
tags:
  - JavaScript
  - React
description: ''
---

## 什么是组件？

React 重新定义了我们的开发方式, 由组件的方式来组合, 嵌套形成我们的网页。组件开发特性之一是代码复用, 引用 _React.js 小书_ 中的一个例子 , 页面中需要一个点赞按钮, 点击点赞则按钮上的文本变为取消。

```javascript
<button class='like-btn'>
  <span class='like-text'>点赞</span>
  <span>👍</span>
</button>

<script>
  let flag = true;
  document.querySelector('.like-btn').addEventListener('click', function(){
    flag = !flag
    document.querySelector('.like-text').innerHTML = flag?'点赞':'取消'
  })
</script>

```

那如果我们还需要一个按钮, 我们要复制一遍 HTML, JS 代码也要改。

```javascript
<button class='like-btn'>
	<span class='like-text'>点赞</span>
	<span>👍</span>
</button>
<button class='like-btn'>
	<span class='like-text'>点赞</span>
	<span>👍</span>
</button>

<script>
	let flag = true;
	document.querySelectorAll('.like-btn').forEach(btn => {
		btn.addEventListener('click', function () {
			flag = !flag;
			this.children[0].innerHTML = flag ? '点赞' : '取消'
		})
	})
</script>
```

显然, 同样的 HTML 写 2 遍很愚, 因此我们可以将它封装成一个组件来复用代码。

```javascript
class Component {
  constructor(props = {}) {
    this.props = props
  }

  setState(state) {
    const oldEl = this.el
    this.state = state
    this._renderDOM()
    if (this.onStateChange) this.onStateChange(oldEl, this.el)
  }

  _renderDOM() {
    this.el = createDomFromString(this.render())
    if (this.onClick) {
      this.el.addEventListener('click', this.onClick)
    }
    return this.el
  }
}

class Like extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLiked: true,
    }
  }

  onClick = () => {
    this.setState({
      isLiked: !this.state.isLiked,
    })
  }

  render() {
    return `
    <button class='like-button' style="background-color:${this.props.bgColor}">
        <span class='like-text'>${this.state.isLiked ? '点赞' : '取消'}</span>
        <span>👍</span>
      </button>
    `
  }
}

function createDomFromString(domString) {
  const div = document.createElement('div')
  div.innerHTML = domString
  return div
}

const mount = (component, wrapper) => {
  wrapper.appendChild(component._renderDOM())
  component.onStateChange = (oldEl, newEl) => {
    wrapper.insertBefore(newEl, oldEl)
    wrapper.removeChild(oldEl)
  }
}

mount(new Like({ bgColor: 'red' }), document.body)
mount(new Like({ bgColor: 'blue' }), document.body)
```

虽然是一个小小的例子, 但是基本说明了封装组件的原理, 这里有 3 点要说明一下:

1. 组件通过`state`来维护界面, 即当 state 改变则 UI 变化
   当子组件 Like 的 state 发生变化时, 则调用父类的`setState`方法来重新赋值 state, 调用子组件 Like 的`render()`方法来生成新的 DOM 节点并且调用我们在`mount`中注册的回调函数`component.onStateChange = fn`来删除旧节点, 插入新节点。

2. 子组件中可以通过`this.props`访问传进来的参数
   在 Like 组件的 constructor 中调用`super(props)`将参数传递给父组件, 父组件中通过`this.props = props`之后, 即可在 Like 中使用`this.props`来获取传进来的参数。
   
3. this 指向问题
   在程序中我们刻意使用**箭头函数**来防止 this 的作用域会修改, 比如`onClick`函数中如果不使用箭头函数, 则无法通过 this 来访问到 Like 内部的`setState`以及`state`。

从这里例子我们可以看到父组件`Component`抽离出了子组件中都会重复的部分, 让我们开发子组件时只要关心`render()`中的 HTML 模版以及 state 变化的逻辑。

## 什么是 React？

React 就是利用组件化开发 Web 应用的一种 UI 解决方案: 即状态更改则 UI 更新的。如果要实现一个完整的 Web 应用我们还需要其他 React 相关工具, 比如使用 react-router 实现页面的跳转逻辑。

###  构建 React App

```bash
 npx create-react-app my-react-app
```

### UI 与 Render

我们在开篇的例子中`mount`的作用是将组件挂载在指定节点, React 也提供了`ReactDOM.render`方法实现相同的功能。

```javascript
ReactDOM.render(<App />, document.getElementById('root'))
```

下面让我们看下`<App />`长什么样子

```javascript
export class App extends Component {
 render() {
    return (
      <div> Hello React </div>
    )
}
```

基本和我们开篇例子中的`render`长的一样, 唯一不同的是直接 return 了 HTML 标签, 这样的语法称为 JSX,  浏览器认识这样的语法并不会报错是因为网页在运行之前会将 JSX 语法通过**Babel 编译器**将`return`的 HTML 标签转化为一个 JS 对象从而使语法合法

![EVtht0.png](https://s2.ax1x.com/2019/04/24/EVtht0.png)

为什么要先从 HTML 转换成 JS 对象然后渲染成 DOM 元素而不是直接改变 HTML 从而让 DOM 重新渲染呢？这就是 MVVM 框架的另一个核心特性:**虚拟节点**, 将 HTML 转换成的这个 JS 对象也称为虚拟节点, 目的是使用 JS 计算降低 DOM 渲染的次数。比如一系列的 DOM 操作会引起一系列的 DOM 渲染降低应用性能,  通过虚拟节点则可以用 JS 来计算这一系列操作, 只将最终的结果进行一次渲染, 实现了同样的结果但只使页面渲染了一次从而提高了应用性能。

JSX 语法就是 HTML 和 JS 混用, 有以下几点要注意的地方:

1. render()的 return 必须仅有一个最外层元素
2. 在 JSX 中使用 JS 语法需要用`{}`包裹起来
3. JSX 中使用 HTML 属性`for以及class`会与 JS 语法冲突, 因此要用`htmlFor`和`className`代替
4. 条件返回`null`可以实现隐藏的效果 { isGoodWord ? is good : null }
5. 绑定事件用`onClick`, `onKeyDown` 这样的形式
6.  遍历数据 `{[<li>list</li> ...]}` 可以通过`map`方法以及添加`key`值
7. 如果不想让 HTML 代码被转义为普通文本使用`dangerouslySetInnerHTML={{__html: this.state.content}}`属性
8. style 接受一个对象`<h1 style={{fontSize: '12px', color: this.state.color}}>el</h1>`

### state 与 props

React 和我们在开篇例子中一样, 使用 state 来维护 UI。

```javascript
class App extends Component {
  constructor() {
    super()
    this.state = { isLiked: false }
  }

  changeText = (str, e) => {
    console.log(str) // hi
    this.setState({
      isLiked: !this.state.isLiked,
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.changeText.bind(this, 'hi')}>
          {this.state.isLiked ? '取消' : '点赞'}
        </button>
      </div>
    )
  }
}
```

需要注意的是, 必须通过`this.setState`改变 state 的状态, 直接赋值是无效的比如`this.state = {isLiked: 'dislike'}`。当调用`setState`时, state 不会立马改变 。来举个例子:

```javascript
this.state = { name: 'max' }
this.setState({
  name: 'evle',
})
console.log(this.state.name) // max
```

state 没有被立马改变, 那如果我们想用改变后的值怎么办? 可以给`this.setState()`第二个参数传递一个回调函数

```javascript
this.setState(
  {
    name: 'evle',
  },
  () => {
    console.log(this.state.name)
  }
) // evle
```

多次`setState`操作不会引起性能上的问题, React 内部会合并多次`setState`操作, 此外我们为了演示传递参数, 在绑定`onClick`事件时通过`.bind()`传递了一个`hi`。

下面我们介绍下`props`, `props`一旦传入不可以由子组件对其修改, 只能通过父组件重新渲染修改。给子组件传递一个参数可以直接给组件添加属性`<Person name='max' sex='male'></Person>`, 然后在子组件中使用`this.props`来获取参数, 除了传递对象外还可以传入函数`<Person onClick={() => console.log('Click on like button!')}/>`, 在子组件中通过`this.props.onClick()`来调用。

```javascript
  let name = {this.props.name} || 'default name';
  let sex = {this.props.sex} || 'default sex';
  return (
    <div>
      name: {name} sex: {sex}
      <button onClick={this.props.onClick}></button>
    </div>
  )
```

上面这样使用`||`来提供默认参数不优雅, React 内置了一个`defaultProps`来提供默认参数

```javascript
static defaultProps = {
  name: 'default names',
  sex: 'default sex'
}
...
return (
  <div>name: {this.props.name} sex: {this.props.sex}</div>
)

```

`state`主要用于维护组件内部状态, 外部无法访问, `props`则是让外部组件对自己进行配置。组件中过多的`state`会造成状态多不好管理, React 鼓励无状态组件也叫做函数式组件即内部没有 state, 定义起来非常便捷

```javascript
const HelloWorld = props => {
  const sayHi = event => alert('Hello World')
  return <div onClick={sayHi}>Hello World</div>
}
```

## 组件开发方式

组件化的开发就像在拼积木, 依然引用 _React.js 小书_ 的例子: 开发一个评论框

[![EVT9BQ.png](https://s2.ax1x.com/2019/04/24/EVT9BQ.png)](https://imgchr.com/i/EVT9BQ)

在面对这样一个 UI 的时候我们首先要把它拆分成几个组件, 如图该 UI 被拆分成 4 个组件分别是: CommentApp、CommentInput、CommentList、Comment。拆分成多个组件后我们就应该思考它们之间如何通信, 组件与组件是兄弟还是父子的嵌套关系, 然后将 UI 抽象成一颗组件树。

[![EVTpng.png](https://s2.ax1x.com/2019/04/24/EVTpng.png)](https://imgchr.com/i/EVTpng)

- CommentApp 是 Root Component 最后使用 react-dom 的 render 方法插入到页面的 root div 中
- CommentApp 插入 CommentInput 并传入`this.props.onReceive`函数, CommentInput 接收到用户的数据通过  调用`this.props.onReceive(data)`将数据传递给 CommentApp 并由 CommentApp 内部 state 管理
- CommentApp 将用户数据传递给 CommentList 通过`<CommentList comments={this.state.comments}`, CommentList 通过`this.props.comments`接收到数据后使用 map 将每条数据渲染到 Comment 组件中。

在设计组件通信时我们要注意一个名词叫做状态提升,当某个状态被多个组件依赖或者影响的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 props 传递数据或者函数来管理这种依赖或着影响的行为。

### ref 操作 DOM

ref 用于获取已经挂载  的元素的 DOM 节点,  给要获取的节点添加`ref`属性, 值为一个函数, 当添加`ref`的元素挂载到页面上后, React 会调用这个函数并将 DOM 节点传进来。

```javascript
  componentDidMount () {
    this.input.focus()
  }

  render () {
    return (
      <input ref={(input) => this.input = input} />
    )
  }
```

### props.children 和 容器类组件

举例: Card 是一个容器类组件, 我们把 UI 插入该容器里, 然后通过`this.props`显示传入的 UI

```javascript
<Card
  content={
    <div>
      <h2>React.js 小书</h2>
      <div>开源、免费、专业、简单</div>
      订阅：
      <input />
    </div>
  }
/>
```

React 提供我们一种更简单及易于管理的 UI 插入方式

```javascript
<Card>
  <h2>React.js 小书</h2>
  <div>开源、免费、专业、简单</div>
  订阅：
  <input />
</Card>
```

在 Card 组件中我们就可以通过`props.children`来获取。

### 参数验证

组件如果不检查传递进来的参数, 页面会显示异常, 为了避免下面这种情况我们要给组件添加参数验证。

```javascript
<Comment comment={0} />

// Comment Component
 render () {
    return (
      <div className='comment'>
        <span>{comment.username} </span>：
        <p>{comment.content}</p>
      </div>
    )
  }
```

先安装`yarn add prop-types`, 然后就可以像使用`defaultProps`一样添加参数检查, 如果传递进来的参数类型不正确则会提示错误。

```javascript
static propTypes = {
    comment: PropTypes.object.isRequired
}

render () {
  return (
    <div className='comment'>
      <span>{comment.username} </span>：
      <p>{comment.content}</p>
    </div>
  )
}
```

### dangerouslySetInnerHTML 处理

`dangerouslySetInnerHTML`使用时要注意 XSS 攻击, 所以如果要实现将用户输入的\`console.log(1)\`渲染为`console.log(1)`, 也就是将**`**包括的代码, 替换为\<code\>包裹起来, 需要对字符串转义。

```javascript
<p dangerouslySetInnerHTML={{__html: _getProcessedContent(this.props.data)}}></p>

_getProcessedContent (content) {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/`([\S\s]+?)`/g, '<code>$1</code>')
}
```

### 组件书写规范

- static 开头的类属性，如 defaultProps、propTypes
- 构造函数，constructor
- getter/setter
- 组件生命周期
- \_ 开头的私有方法
- 事件监听方法，handle\*
- render*开头的方法，有时候 render() 方法里面的内容会分开到不同函数里面进行，这些函数都以 render* 开头
- render() 方法

## React 生命周期

理解 React 生命周期我们先看下面的例子

```javascript
ReactDOM.render(<App />, document.getElementById('root'))
```

上面代码会被编译成

```javascript
ReactDOM.render(React.createElement(App, null), document.getElementById('root'))
```

参照开篇例子, 我们大致能猜出它的工作原理

```javascript
// React.createElement 中实例化一个 Header
const app = new App(props, children) // constructor()
// React.createElement 中调用 header.render 方法渲染组件的内容
const appJsxObject = app.render() // render()

// ReactDOM 用渲染后的 JavaScript 对象来来构建真正的 DOM 元素
const appDOM = createDOMFromObject(appJsxObject)
// ReactDOM 把 DOM 元素塞到页面上
document.getElementById('root').appendChild(appDOM) // append DOM
```

React 将组件渲染并构造 DOM 元素然后插入页面的过程叫做组件挂载, React 内部对待每个组件都有这么一个过程, 初始化组件然后挂载到页面上

```javascript
constructor()
render()
```

React 为了让我们更好的控制事件挂载的过程提供了`componentWillMount()`,`componentDidMount()`和`componentWillUnmount()`方法

```javascript
constructor()
componentWillMount()
render()
componentDidMount()
componentWillUnmount()
```

我们一般会把组件的 state 的初始化工作放在 constructor 里面去做；在 componentWillMount 进行组件的启动工作，例如 Ajax 数据拉取、定时器的启动；组件从页面上销毁的时候，有时候需要一些数据的清理，例如定时器的清理，就会放在 componentWillUnmount 里面去做。

当组件的状态或属性改变时用来更新组件的生命周期有 5 个

```javascript
componentWillReceiveProps()
shouldComponentUpdate()
componentWillUpdate()
render()
componentDidUpdate()
```

当组件崩溃时有 1 个生命周期函数

```javascript
componentDidCatch()
```

## Higher-Order Components

高阶组件是一个函数, 给它传一个组件, 返回一个新的组件。高阶组件的目的是为了组件之间的代码复用。

可以把一些可复用的逻辑放在高阶组件当中，高阶组件包装的新组件和原来组件之间通过 props 传递信息，减少代码的重复程度。

```javascript
import React, { Component } from 'react'

export default WrappedComponent => {
  class NewComponent extends Component {
    render() {
      return <WrappedComponent />
    }
  }
  return NewComponent
}
```

## context

React 的 context 就像 JavaScript 中的全局变量, 组件之间共享状态不需要通过一级一级传递, 但不推荐使用因为会使各组件之间状态混乱。`getChildContext`方法就是设置 context 的过程, 它的返回对象就是 context, 所有组件都可以访问到这个对象使用`this.context.themeColor`。

```javascript
childContextTypes = {
  themeColor: PropTypes.object
}

getChildContext () {
  return { themeColor: this.state.themeColor }
}
```

但是使用 context 有以下 2 点要注意:

1. 提供 context 的组件必须提供 childContextTypes 作为 context 的声明和验证
2. 使用它的组件也必须使用`contextTypes`进行验证

## 什么是 Redux

前面提到 context 解决组件之间共享状态的方法, 但是这种方法由于太"随便了"不适合构建大型应用。我们需要修改和获取全局状态复杂一点。

Redux 就是一种管理全局 State 的方法, 它的基本原理: 构建一个对象提供 3 个接口: 获取全局状态, 设置全局状态, 注册回调(用于设置完全局状态后调用)

每当设置完全局状态, 调用回调渲染 DOM, 这时要注意性能问题, 数据没有变化就不重新渲染, 相关处理如下:

```javascript
// 数据没变化不重新渲染:
if (newTitle === oldTitle) return

// 注意
const oldState = appState
appState.title.text = 'React.js'
oldState !== appState // false

// 实现
function createStore(reducer) {
  let state = null
  const listeners = []
  const subscribe = listener => listeners.push(listener)
  const getState = () => state
  const dispatch = action => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}
```

`createStore`接受一个`reducer`函数作为参数, 该函数有 2 个参数, `state`和`action`, reducer 不允许有副作用, 它能做的只有**初始化和计算新的 state** 示例:

```javascript
function themeReducer(state, action) {
  // 初始化state
  if (!state)
    return {
      themeName: 'Red Theme',
      themeColor: 'red',
    }

  // action是计算新的state 也就是允许修改什么
  switch (action.type) {
    case 'UPATE_THEME_NAME':
      return { ...state, themeName: action.themeName }
    case 'UPATE_THEME_COLOR':
      return { ...state, themeColor: action.themeColor }
    default:
      return state
  }
}

const store = createStore(themeReducer)
```

现在来看全局状态管理有以下过程:

```javascript
// 定一个 reducer
function reducer (state, action) {
  /* 初始化 state 和 switch case */
}

// 生成 store
const store = createStore(reducer)

// 监听数据变化重新渲染页面
store.subscribe(() => renderApp(store.getState()))

// 首次渲染页面
renderApp(store.getState())

// 后面可以随意 dispatch 了，页面自动更新
store.dispatch(...)
```

通常 reducer 函数为了方便管理会单独建立一个文件夹`reducers`, 书写 reducers 规则如下：

- 定义 action types
- 编写 reducer
- 跟这个 reducer 相关的 action creators

举例:

```javascript
const INIT_COMMENTS = 'INIT_COMMENTS'
const ADD_COMMENT = 'ADD_COMMENT'
const DELETE_COMMENT = 'DELETE_COMMENT'

export default function(state, action) {
  if (!state) {
    state = {
      comments: [],
    }
  }

  switch (action.type) {
    case INIT_COMMENTS:
      return {
        comments: action.comments,
      }
    case ADD_COMMENT:
      return {
        comments: [...state.comments, action.comment],
      }
    case DELETE_COMMENT:
      return {
        comments: [
          // generate a new array
          ...state.comments.slice(0, action.commentIndex),
          ...state.comments.slice(action.commentIndex + 1),
        ],
      }
    default:
      return state
  }
}

export const initComments = comments => {
  return {
    type: INIT_COMMENTS,
    comments,
  }
}

export const addComment = comment => {
  return {
    type: ADD_COMMENT,
    comment,
  }
}

export const deleteComment = comment => {
  return {
    type: DELETE_COMMENT,
    comment,
  }
}
```

## 什么是 React-redux

把 React 的 content 结合 Redux 使用就叫做 React-redux

```javascript
const store = createStore(themeReducer)

static childContextTypes = {
  store: PropTypes.object
}

getChildContext () {
  return { store }
}
```

依赖该状态的组件只要在其`componentWillMount`中获取`this.context`后使用`store.dispatch`, `store.getState` 和`store.subscribe`即可

```javascript
componentWillMount () {
  this._updateThemeColor()
}

_updateThemeColor(){
  const { store } = this.context
  store.getState()
  store.dispatch()
  store.subscribe()
}
```

但这样会存在 2 个问题: **有大量重复的逻辑** 和 **对 context 依赖性过强**

什么样的组件复用性? 只依赖于外界传进去的`props`和自己的`state`, 并不依赖其他人外界任何数据的组件复用性最强, 通过查看
`PropTypes`看它能够接收什么样的参数, 然后把参数穿进去控制它就行, 这种组件叫做 Dumb Component。惯用手法是

> 多写 Dumb 组件, 然后用高阶组件把他们包装一层, 高阶组件和 context 打交道, 把里面数据取出来通过`props`传给 Dumb 组件

这个高阶组件叫做`connect`，它将 Dumb 组件和 context 连接起来

![ElMDaj.png](https://s2.ax1x.com/2019/04/29/ElMDaj.png)

connect 的实现:

```javascript
export const connect = (
  mapStateToProps,
  mapDispatchToProps
) => WrappedComponent => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object,
    }

    constructor() {
      super()
      this.state = {
        allProps: {},
      }
    }

    componentWillMount() {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }

    _updateProps() {
      const { store } = this.context
      let stateProps = mapStateToProps
        ? mapStateToProps(store.getState(), this.props)
        : {} // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
        ? mapDispatchToProps(store.dispatch, this.props)
        : {} // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props,
        },
      })
    }

    render() {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}
```

从上面实现我们可以看出实现 connect 有以下几个关键

1.connect 接收参数的问题
connect 接收 2 个参数:`mapStateToProps`和`mapDispatchToProps`。

我们获取`this.context`中的数据时, 使用了`mapStateToProps`来规定我们需要获取`this.context`中的哪些数据, 比如我们想获取`themeColor`:

```javascript
const mapStateToProps = state => {
  return {
    themeColor: state.themeColor,
  }
}
```

而`mapDispatchToProps`则是告诉 Dumb 组件如何处理状态的更改

```javascript
const mapDispatchToProps = dispatch => {
  return {
    onSwitchColor: color => {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    },
  }
}
```

2.将获取到的数据保存在 connect 的 state 中

```javascrip
   this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
   )
```

3.将 state 传递给 dumb 组件, 使 Dumb 组件可以像`this.props.themeColor`这样使用。

```javascript
return <WrappedComponent {...this.state.allProps} />
```

最后在使用的时候我们只需要像下面示例代码一样

```javascript
class ThemeSwitch extends Component {
  static propTypes = {
    themeColor: PropTypes.string,
    onSwitchColor: PropTypes.func,
  }

  handleSwitchColor(color) {
    if (this.props.onSwitchColor) {
      this.props.onSwitchColor(color)
    }
  }

  render() {
    return (
      <div>
        <button
          style={{ color: this.props.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'red')}
        >
          Red
        </button>
        <button
          style={{ color: this.props.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'blue')}
        >
          Blue
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    themeColor: state.themeColor,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onSwitchColor: color => {
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    },
  }
}
ThemeSwitch = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeSwitch)

export default ThemeSwitch
```

简单的来说, connect 就是封装了每个组件都会操作 store 的重复代码, 这些重复代码主要包括 2 类: `store.getState`和`store.dispatch`。
这样我们在使用全局 state 的时候无需关心 store 的操作, 只要描述我们要从全局 state 中获取什么样的数据, 以及怎么更新全局 state 即可。

目前为止我们用 connect 隐藏了操作 context 的细节, 但是我们的根组件中依然有创建全局状态的代码, 为了让 context 彻底从业务代码中清除, 我们可以新建一个`Provider`组件充当根组件来初始化全局 state

![ElQQS0.png](https://s2.ax1x.com/2019/04/29/ElQQS0.png)

```javascript
export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any,
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  getChildContext() {
    return {
      store: this.props.store,
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}
```

## Dumb 与 Smart 组件

我们规定：所有的 Dumb 组件都放在 components/ 目录下，所有的 Smart 的组件都放在 containers/ 目录下，这是一种约定俗成的规则。

举个划分组件的例子, 一个 Header 组件由于用到了`connect`, 因此不算一个 Dumb 组件, 但我们可以将它划分成 Dumb 组件

```javascript
// Dumb
import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Header extends Component {
  static propTypes = {
    themeColor: PropTypes.string
  }

  render () {
    return (
      <h1 style={{ color: this.props.themeColor }}>React.js 小书</h1>
    )
  }
}

// Smart
import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}
export default connect(mapStateToProps)(Header)
```

Dumb 组件与 Smart 组件交互如下所示:

![El2z7D.png](https://s2.ax1x.com/2019/04/29/El2z7D.png)

这种交互有点类 MVC 的感觉, Dumb 组件是 View, 负责渲染数据, state 是 Model, Smart 组件是 Controller

最后总结下 React 开发的项目结构实践:
index.js 中创建 `store`, 传给 `Provider`, `Provider` 中插入根组件,  挂载 `Provider` 到页面上
考虑组件的复用性, 如果需要复用尽可能设计成 Dumb 组件也就是只依赖自身 `state` 与 `this.props`。 Smart 组件用`connect`包一层与`context`交互的代码, 确保业务代码清晰。

## React Antd

React Antd 是一个 UI 框架, 提炼自企业级中后台产品的交互语言和视觉风格。

```javascript
yarn add antd
```

### 使用

1. 引入 CSS

```javascript
import 'antd/dist/antd.css'
```

2. 查阅官方文档使用

```javascript
import { Button } from 'antd'

ReactDOM.render(
  <div>
    <Button type="primary">Submit</Button>
  </div>,
  mountNode
)
```

## React Router

使用 React Router 构建应用的路由

```javascript
yarn add react-router-dom
```

Router 的规划在 React 应用中也是在编码前需要走心的, react-router-dom 包含 2 种 Router: `BroswerRouter`和`HashRouter`。我们通常使用`BroswerRouter`

1. 用 BroswerRouter 把根组件比如 App 包起来

```javascript
<BroswerRouter>
  <App />
</BroswerRouter>
```

2. 用 `Switch` 包`Route`定义路由规则, 把路径和组件绑定起来

```javascript
// 路由切换了也会在这个容器内展示
<div>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/roster" component={Roster} />
    <Route path="/schedule" component={Schedule} />
  </Switch>
</div>
```

3. 用`Link`实现跳转到指定路由

```javascript
<Link to="/">Home</Link>
<Link to="/list">List</Link>
```

4. 路由嵌套

访问某一篇文章, 某一个人员我们都会嵌套路由根据后面的 **唯一标识** 识别

定义一个嵌套路由:

```javascript
<Route path="/roster/:number" component={Player} />
```

跳转到嵌套路由:

```javascript
<Link to={`/roster/${p.number}`}>{p.name}</Link>
```

在组件中获取唯一标识

```javascript
const Player = (props) => {
  let number = props.match.params.number

  return(){<div>唯一标识: {number}</div>}
}
```
