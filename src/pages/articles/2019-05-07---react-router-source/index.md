---
title: 'React Router源码分析及实现'
date: '2019-05-07'
layout: post
draft: false
path: '/posts/react-router-source'
category: 'React'
tags:
  - React
description: ''
---

## 介绍

React Router 的实现依赖于一个操作 HTML5 histroy API 的库 `history`, 每个路由组件都会创建一个`history`对象来追踪当前的地址 (history.location)并且之前的地址会保存在 history stack 中, 当前 URL 发生改变时, 视图会重新渲染。当点击`<Link>`组件, React Router 会调用`history.push()`改变 URL, 当点击`<Redirect>`组件时, React Router 会调用`history.replace()`来替换当前 history state。

## 前置知识

在以前没有 Histroy API 之前, 更该 URL 有 2 种方式, 一种是能通过`window.location`更改, 但缺点很明显是会重新加载页面, 另一种是通过`hash`比如`<a href="#home">Home</a>`这样的方式。HTML5 History API 提供给我们操作历史浏览的权限, 通过 `window.history.length` 总共记录了几个页面:

如果从 A 页面跳转到 B 页面再跳转到 C 页面, 那么`window.history.length`就是 `3`, 可以通过 `history.back()` 和 `history.forward()` 在这 3 个页面回来切换。我们还可以通过更简便的方法来切换页面就是使用`history.go()`, 如果参数为正数就是向前, 如果是负数就是返回 。 简单来说就是:

```bash
history.back()
history.back()

// 等价于

history.go(-2)
```

除了历史页面的切换外, History API 还赋予我们增加和修改**history entires**的能力, 提供了`history.pushState()`和`history.replaceState()`方法。2个方法的区别是: **pushState是push到history stack, 会使得History.length加1, 而replaceState是替换当前的这条会话历史, 因此不会增加History.length** 我们可以通过

```javascript
history.pushState({ data: 123 }, null, 'home')
```

来切换到一个新的 history entry, 比如我们当前的网站是 `https://www.xx.com` 那么执行上面语句后我们地址就会成为 `https://www.xx.com/home`, 并且可以通过 `histroy.state`得到我们之前保存的对象`{data: 123}`, 需要注意的是: **通过这样的方法改变 URL, 不会使页面发生跳转, 这也是 React Router 实现路由的关键** , 那我们怎么监听URL的变动呢? 可以通过监听`popstate`实现

```javascript
window.addEventListener('popstate', function(event){
   console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
})
```

但只有调用`back()`, `forward()`和`go()`的时候会触发该回调,它们都会重载页面, 我们通过`pushState`和`replaceState`改变页面URL的时候, 该监听**不生效**, 因此我们需要重写这两个方法

```javascript
var _wr = function(type) {
  // 抽象接口 易于使用
   var orig = history[type];
   return function() {
       // 调用方法本身
       var rv = orig.apply(this, arguments);
      // 创建事件 然后dispatch
      var e = new Event(type);
       e.arguments = arguments;
       window.dispatchEvent(e);
       return rv;
   };
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
```

改写这两个方法后, 那么让我们实现一个简单的监听页面变动更新页面：

```javascript
let page = document.querySelector('main');
window.addEventListener('pushState', function (evt) {
  page.textContent = history.state && history.state.page
})

let links = Array.from(document.querySelectorAll('button'));
links.forEach(link => {
  link.addEventListener('click', function () {
    let path = this.getAttribute('path')
    let content = this.getAttribute('content')
    history.pushState({
      page: content
    }, null, path)
  })
})
```

效果如下

![Eyxufe.gif](https://s2.ax1x.com/2019/05/08/Eyxufe.gif)

我们可以将其封装成一个类使它更加易于使用和维护

```javascript
class Routers {
  constructor() {
    this.routes = {};
    // 在初始化时监听popstate事件
    this._bindPopState();
  }
  // 初始化路由
  init(path) {
    history.replaceState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 将路径和对应回调函数加入hashMap储存
  route(path, callback) {
    this.routes[path] = callback || function() {};
  }

  // 触发路由对应回调
  go(path) {
    history.pushState({path: path}, null, path);
    this.routes[path] && this.routes[path]();
  }
  // 后退
  backOff(){
    history.back()
  }
  // 监听popstate事件
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }
}
```

有了基础铺垫下一步让我们来看下React Router是如何实现的

## React Router实现

React提供的2种路由`<BrowserRouter>`和`<HashRouter>`分别对应我们之前讨论过的history API实现和hash实现(历史遗留), 在开发React应用时我们普遍使用`<BrowserRouter>`

```javascript
ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById('root'));
```

`<BrowserRouter>`创建了一个history实例, 加载了`Router`组件并将history实例和`<App/>`组件作为参数。

```javascript
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

在`Router`组件中, 调用了history实例的`listen`方法来监听URL的变动, 当有变动时, 设置`match`的状态。

```javascript
this.unlisten = history.listen(() => {
  this.setState({
    match: this.computeMatch(history.location.pathname)
  });
});
```

当`Router`更新了`state`, 那么`Route`组件的`componentWillReceiveProps`中会接收到改动过的URL地址, 如果匹配的话则设置`this.state.match`为`true`, 然后开始`render`流程

```javascript
render() {
  const { match } = this.state; // 布尔值，表示 location 是否匹配当前 Route 的 path
  const { children, component, render } = this.props; // Route 提供的三种可选的渲染方式
  const { history, route, staticContext } = this.context.router; // Router 传入的 context
  const location = this.props.location || route.location;
  const props = { match, location, history, staticContext };

  if (component) return match ? React.createElement(component, props) : null; // Component 创建

  if (render) return match ? render(props) : null; // render 创建

  if (typeof children === "function") return children(props); // 回调 children 创建

  if (children && !isEmptyChildren(children)) // 普通 children 创建
    return React.Children.only(children);

  return null;
}
```

可以看到render有多种渲染组件的方式, 如果我们给Route设置的是一个component比如`<Route path='/product' component={Product} />`那么当URL变动为`/product`匹配成功时则会设置`match`为`true`, 然后调用`React.createElement`渲染组件。流程大致如下：

![EcMu7V.png](https://s2.ax1x.com/2019/05/08/EcMu7V.png)

```javascript
<Switch>
  <Route path='/product' component={Product} />
  <Route path='/about' component={About} />
</Switch>
```

React Router中的`<Link>`就很像`<a href="/anywhere">`标签一样, 点击了会跳转到`href`指定的链接,但SPA应用不刷新应用怎么做呢? 从前面的基础知识我们可以猜到我们要做的就是防止a标签的默认行为, 监听到a的点击事件后用history API来实现页面的跳转。

```javascript
<Link to="/product"></Link>
```

下面让我们看下React Router是如何实现它的：

```javascript
render() {
    const { replace, to, innerRef, ...props } = this.props;
     const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      {/* 这里是href是为了HTML语义化,没有生效 因为在handleClick中会禁止跳转行为 */}
      <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }

  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      // 阻止a标签的默认行为
      event.preventDefault();
      const { history } = this.context.router;
      const { replace, to } = this.props;
      if (replace) {
        history.replace(to);
      } else {
        // 改变页面的URL
        history.push(to);
      }
    }
  };
```

在点击了`Link`标签后内部只是调用了`history.push`或者`history.replace`来改变URL, 当页面URL改变后, 则通过我们讨论的流程进行匹配并且render组件。

最后让我们看下`withRouter()`， 该函数的作用是: 在不是通过路由切换过来的组件中(也就是this.props.history是undefined)，将react-router 的 history、location、match 三个对象传入props对象上。它的实现也非常简单, 使用context来传递history, location, match对象。 React Router V4使用的Context是最新用法, 和**React的基础回顾**一文中的context用法有很大的差别, 先让我们看下新版本的Context是如何使用来共享状态的。

```javascript
// 1. 创建状态
const ThemeContext = React.createContext('light');

// 2. 将Context从根组件向下传递
class App extends React.Component {
  render() {
    // 共享主题颜色 dark
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

//中间组件，并不关心和他无关的参数 无需逐级传递props
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

//使用参数的组件
function ThemedButton(props) {
  // 使用Consumer组件包裹需要获取参数的组件 theme就是dark
  return (
    <ThemeContext.Consumer>
      {theme => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}
```

有了上面的基础我们再来看withRouter的实现就很简单了:

```javascript
function withRouter(Component) {
  // 传进来组件 Component
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;

    return (
      <RouterContext.Consumer>
        {context => {
          return (
           {/* 使用Consumer获取Context并且传递给传进来的组件 */}
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          );
        }}
      </RouterContext.Consumer>
    );
  };
```

## 总结

通过本篇的分析我们了解React Router的本质就是做了两件事情: 改变URL和 根据当前的URL渲染组件。让我们来回顾下它如何完成这两件事情的

1. <Router>的`componentWillMount`中使用`history.listen`监听整个应用URL的变化
2. 点击<Link>调用`history.push`更改URL
3. Router监听到URL的变化去修改state, 修改state触发Route的`componentWillReceiveProps`接收到新的URL地址, 比较新的URL地址和自身的path是否匹配, 如果匹配就渲染。