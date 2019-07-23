---
title: '理解Redux设计与应用'
date: '2019-05-30'
layout: post
draft: false
path: '/posts/redux-tutorial'
category: 'Redux'
tags:
  - Redux
description: ''
---

异步动作

同步的返回的通常使用一个 javascript pailn object
异步 return 一个 function f

thunk

```javascript
import { createLogger } from 'redux-logger'

// 先加载异步操作的中间件 thunk from redux-thunk
const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

const store = createStore(reducer, applyMiddleware(...middleware))
```

Docker 部署
静态部署（React） + node 部署

1. 容易 轻量虚拟机
2. nginx + docker

自动化
轻量级
多版本共存，环境问题

docker 里装 nginx 代码里维护 nginx 配置

从 docker hub 的 registry 把镜像拉到 container

Typescript + React

React Hook

functional component for everything

State Hook
counter

initial state
count setCount = useState(0)

 Effect Hook
perform side effects from a function component such as data fetching
 componentDidMount, componentDidUpdate, and componentWillUnmount in React classes

 // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  Rules
  Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions.
Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions. 

React integration with Third Party Libraries

shouldComponentUpdate(){
  return false
}

componentDidMount(){
  new google.maps.Map(, {
    center:{lat}
    zoom: 8
  })

  render(){
    return (
      <div id="map" ref="map">
    )
  }

}


开发一个通用组件 Antd



npm install redux react-redux redux-thunk --save

