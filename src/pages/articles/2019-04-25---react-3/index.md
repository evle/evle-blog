---
title: "精通React第三天"
date: "2019-04-25"
layout: post
draft: true
path: "/posts/react-3"
category: "React"
tags:
  - 
description: ""
---


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

5. 重定向

比如登录逻辑, 在`/login`后要重定向到`/home`页面

```javascript
<Redirect to={pathname: '/home'} />
```
