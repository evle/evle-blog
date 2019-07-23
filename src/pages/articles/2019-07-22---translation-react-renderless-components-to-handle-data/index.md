---
title: "在React中使用Renderless组件处理数据 (翻译)"
date: "2019-07-22"
layout: post
draft: false
path: "/posts/translation-react-renderless-components-to-handle-data"
category: "React"
tags:
  - 
description: ""
---

划重点: 在React应用中，你应该使用无渲染组件去管理数据和状态为了组件的复用性和可组合性, 讲真！

很多React的使用者容易疏忽一个问题: 不是所有的组件都需要渲染UI。举个例子, 当获取数据时候很多人会这样写

```javascript
import React, { Component } from "react";

class DataList extends Component {
  state = {
    loading: true,
    error: false,
    data: [],
  };

  componentDidMount() {
    fetch("/mock-data")
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(data => this.setState({ loading: false, data }))
      .catch(error => this.setState({ loading: false, error }));
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Oops! Something went wrong: {error}</p>;
    }

    return (
      <ul>
        {data.map(item => <li key={item.id}>{item.label}</li>)}
      </ul>
    );
  }
}
```

## 重构: composition, SRP and SOC

模块化开发(组件化开发)实现分离关注点是React的使用哲学, 组件显而易见是可以组合的并且它们应该遵循单一职责的设计理念。 在上面的例子中我们需要考虑两点: 获取数据 和 渲染不同的UI状态。因此我们在设计中应该有以下思考:

- 无渲染组件用来获取数据
- 使用纯函数组件渲染不同的UI状态： Loading, Error和 List
- DataList组件将这些部分连接起来
- 这些小的组件可以在我们应用的其他地方复用

```javascript
import React from 'react'

class Fetch extends Component{
  state = {
    loading: true,
    error: false,
    data:[]
  }
  
  componentDidMount(){
    fetch(this.props.url)
      .then(res=>{
        if(!res.ok){
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(data => this.setState({ loading: false, data}))
      .catch(error => this.setState({ loading: false, error}))
  }

  render(){
    return this.props.children(this.state);
  }
}
```

`Fetch` 是一个Renderless组件意味着它只渲染数据而不渲染UI, 当从服务端拿到数据后, 将数据通过props传递给子组件。

```javascript
const Loading = () => <p>Loading</p>;

const Error = error => <p>Oops! Something went wrong: {error}</p>

const List = ({ items, renderItem }) => (
  <ul>
    {data.map(item => <li key={item.id}>{renderItem(item)}</li>)}
  </ul>
);
```

`Loading`, `Error`, `List`均是Pure 函数组件用来渲染UI

```javascript
const DataList = () => (
  <Fetch url="/mock-data">
    {({ loading, error, data }) => (
      <>
        { loading && <Loading /> }
        { error && <Error error={error} />}
        { data.length && <List items={data} renderItem={item => item.label} /> }
      </>
    )}
  </Fetch>
);
```

`DataList`将所有小的组件结合起来, `Fetch`组件获取到数据后传递给子组件, 子组件解构了`Fetch`传递的数据后, 根据状态来选择渲染不同的UI。这样看起来我们的目的达到了。 其实很多开发者已经使用这样的方式构建了灵活和复用性强的组件比如著名的库`react-apllo`。

```javascript
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const QUERY = gql`
  {
    items {
      id
      label
    }
  }
`; 

const DataList = () => (
  <Query={QUERY}>
    {({ loading, error, data }) => (
      <>
        { loading && <Loading /> }
        { error && <Error error={error} />}
        { data.items.length && <List items={data.items} renderItem={item => item.label} /> }
      </>
    )}
  </Fetch>
);
```

同样的, 当我们使用React Hook时可能也会犯同样的错误: 进行了没有必要的UI渲染。 比如下面这样

```javascript
import React, { useState, useEffect } from "react";

const DataList () => {
  const [state, setState] = useState({
    loading: true,
    error: false,
    data: [],
  });

  useEffect(() => {
    fetch("/mock-data")
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(data => setState({ loading: false, error: false, data }))
      .catch(error => setState({ loading: false, error, data: [] }));
  }, []);
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Oops! Something went wrong: {error}</p>;
  }

  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.label}</li>)}
    </ul>
  );
}
```

我们可以通过自定义Hook来重构上面的代码

```javascript
import React, { useState, useEffect } from "react";

const useFetch = url => {
  const [state, setState] = useState({
    loading: true,
    error: false,
    data: [],
  });

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then(data => setState({ loading: false, error: false, data }))
      .catch(error => setState({ loading: false, error, data: [] }));
  }, []);
  
  return state;
};
```

当我们使用时只需要传入需要请求的URL即可得到`data`, `loading`, 和`error`的状态来进行UI的渲染。

```javascript
const Loading = () => <p>Loading</p>;

const Error = error => <p>Oops! Something went wrong: {error}</p>

const List = ({ items, renderItem }) => (
  <ul>
    {data.map(item => <li key={item.id}>{renderItem(item)}</li>)}
  </ul>
);
              
const DataList = () => {
  const { loading, error, data }) = useFetch("/mock-data");

  return (
    <>
     { loading && <Loading /> }
     { error && <Error error={error} />}
     { data.length && <List items={data} renderItem={item => item.label} /> }
    </>
  );
};
```

## 总结

本文并没有讲一些新的东西, 而是加强来对React核心概念的理解，让我们在设计组件的时候可以有意识的提高组件的重用性与灵活性。