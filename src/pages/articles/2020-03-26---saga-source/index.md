---
title: "Redux Saga核心原理实现"
date: "2020-03-26"
layout: post
draft: false
path: "/posts/saga-source"
category: "Redux"
tags:
  - 
description: ""
---

## Saga解决了什么问题?

react-redux无法处理异步任务, 通常我们使用 redux-thunk 来处理异步任务

```javascript
UI -> Dispatch action -> action无法处理异步 X

// thunk
UI -> Dispatch action -> thunk处理异步 -> Reducer -> update state tree -> UI
```

`thunk`是如何解决处理异步任务的? redux的action是一个plain object:`{type: ACTION_TYPE, payload: data}`, dispatch会把这个plain object给reducer, thunk的解决办法是, 让action变为一个函数, 这个函数执行完的时候再创建plain object, 然后让dispatch像之前一样把这个action交给reducer更新状态。那么在这个函数中就可以做一些异步处理, 比如请求远程数据。

```javascript
const actions = {
  asyncAdd(){
    return {type: ADD}
  }
  // => thunk
  asyncAdd(dispatch){
    setTimeout(()=>{
      dispatch({type: ADD})
    }, 1000)
  }
}
```

thunk解决了异步任务的问题, 但是也带来了新的问题, 所有的异步逻辑都被分散在不同的任务中, 不好维护。

saga带来了新的解决方案, 将处理异步逻辑(副作用)从action抽离出来, 更好维护, 更少的模版代码, 更优雅的异步处理, 下面先看saga的使用


## 从一个Counter开始

以一个异步Counter开始, 看Saga的使用, 首先Saga是一个中间件, 需要: 创建中间件, 注册中间件, 启动中间件。

```javascript
let sagaMiddleware = createSagaMiddleware();

const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);

sagaMiddleware.run(rootSaga); // rootSaga就是写Saga任务的地方

export default store;
```

Counter有一个异步的+1操作, 就是延迟1秒后加1, 点击button后会dispatch一个`{type: ASYNC_ADD}`.

```javascript
const actions = {
  asyncAdd() {
    return {
      type: "ASYNC_ADD"
    };
  }
};

class Counter extends React.Component {
  render() {
    return (
      <>
        <button onClick={this.props.asyncAdd}>{this.props.count}</button>
      </>
    );
  }
}
Counter = connect(state => state, actions)(Counter);
```

接下来就是让Saga开始工作的时候了, 首先Saga需要拦截这个`type`, 然后在里面完成我们延迟1秒+1的任务。

```javascript
function* asyncAdd() {
  yield delay(1000);
  yield put({ type: "ADD" });
}

// 负责拦截ASYNC_ADD动作, 拦截到后执行异步任务 asyncAdd
function* watchAsyncAdd() {
  yield takeEvery("ASYNC_ADD", asyncAdd);
}

function* rootSaga() {
  // 运行generator 得到一个iterator
  yield all([watchAsyncAdd()]);
}
```

相比thunk, saga确实是一种更优雅的方法, `dva`中也使用saga来处理异步的任务, 因此掌握saga的原理还是有价值的。

## 从0到1实现Saga的核心原理

### createSagaMiddleware

redux中间件被调用的时机是:

**action dispatch之后, 到reducer之前** 

举个例子, 当用户点击加号按钮派发一个action的时候, saga会捕获这个action进行处理, 当处理接触后再次派发dispatch.

当编写中间件之前我们需要知道我们的中间件是如何被调用的, 才能写出符合被redux正常调用的中间件, 首先我们需要分析下`applyMiddleware`做了什么, **applyMiddleware将action一层一层的传给每一个中间件, 每个中间件可以处理aciton并返回新的action**

下面看它的实现:

```javascript
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 让每个中间件函数携带 middlewareAPI 执行一遍，让每个中间件都可以getState和dispatch
    const chain = middlewares.map(middleware => middleware(middlewareAPI))

    // 将所有中间件连起来 顺序相关
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
```

在saga中, 使用`take`来捕获一次action, 我们在中间件中运行root saga, 得到一个generator, generator的特性是运行一次就会暂停, 也就是我们监听`take`后就将流程暂停到saga中间件中, 等saga中间件执行完saga任务后调用`put`来将action传递给reducer或者其他redux中间件, take, put的实现很简单, 就是返回这两种类型的一个对象 

```javascript
export function take(actionType) {
    return {
        type:'take',
        actionType
    }
}

export function put(action) {
    return {
        type: 'put',
        action
    }
}
```

下面让我们写一个中间件模版来捕获这个action:

```javascript

// 实现一个简单的eventbus用来传递消息
  function createChannel() {
      let listener={};
      function subscribe(actionType,cb) {
          listener[actionType]=cb;
      }
      function publish(action) {
          if (listener[action.type]) {
              let temp=listener[action.type];
              delete listener[action.type];
              temp(action);
          }
      }
      return {subscribe,publish}
  }
  let channel=createChannel();
  function sagaMiddleware({getState,dispatch}) {
     
    // 1. 当用户调用 sagaMiddleware.run(rootSaga) 则启动一个root saga
    // root saga会将传入的generator运行得到一个iterator

     function run(generator) {
          let it=generator();
          function next(action) {
              let {value:effect,done} = it.next(action);
              if (!done) {
                  switch (effect.type) {
                      case 'TAKE':
                          // 捕获action 捕获了任务后就停住了 等待PUT派发新动作
                          channel.subscribe(effect.actionType,next);
                          break;
                      case 'PUT':
                          // 派发action
                          dispatch(effect.action);
                          next();
                          break;
                      case 'CALL':
                          // call就是调用一个promise
                          effect.fn(...effect.args).then(next);
                      default:
                  }
              }
          }
          next();
      }
      sagaMiddleware.run=run;
      return function (next) {
          return function (action) {
              channel.publish(action);
              next(action);
          }
      }
  }
  return sagaMiddleware;
}
```

现在我们的saga中间件已经可以使用`take`拦截命令, 使用`put`派发方法, 以及使用`call`执行函数, 比如`yield put({type: 'ASYMC_ADD'})`, 但是在saga的用法中可以yield一个generator函数比如

```javascript
export function* increment() {
  yield put({type:types.INCREMENT});
}

export function* rootSaga() {
  yield take(types.INCREMENT_ASYNC);

  // increment是一个generator函数
  yield increment();
}
```

因此我们我们在yield的时候多做一个判断, 如果是generator函数的化就`run`这个函数

```javascript
if (!done) {
  if (typeof effect[Symbol.iterator]=='function') {
      run(effect);
      next();
  } else {
      switch (effect.type) {
          case 'TAKE':
              channel.subscribe(effect.actionType,next);
              break;
          case 'PUT':
              dispatch(effect.action);
              next();
              break;
          default:
      }
  }
}
```

我们上面实现的`take`只能完成一次监听, 如果想监听每一次action我们需要使用`takeEvery`, `takeEvery`的实现需要借助`fork`, 一个saga的task就像是一个在后台运行的进程, 在基于redux-saga的应用程序中，可以同时运行多个task, `fork`函数用来创建saga的task.

```javascript
export function* takeEvery(actionType,task) {
    yield fork(function* () {
        // 一直运行
        while (true) {
            yield take(actionType);
            yield task();
        }
    });
}
```

同样我们也需要在saga中间件中增加`fork`的支持

```javascript
...
  case 'FORK':
  run(effect.task);
  next();    
  break;
...
```

基本的功能我们都已经实现了, 还有一点要注意的是, 也可能会遇到yield 一个promise, 比如我们模拟一个dealy函数使用promise

```javascript
const delay=ms => new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve();
    },ms);
});
```

当我们在saga task中这样: `yield delay(1000);`使用时, 我们需要对promise做处理

```javascript
...
    } else if(effect.then){
        // 如果是个promise则调用它
        effect.then(next);
    }
...
```

## 总结

redux-saga提供的功能远远不止本文提到的这么多, 比如取消任务, cps, all等特性都没有介绍, 本文的意图是分析es6的generator在实际的项目中是如何应用的.