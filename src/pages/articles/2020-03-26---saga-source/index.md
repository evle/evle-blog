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

redux的中间件充满着Curring的气息, 它发生在action dispatch之后, 和reducer之前这个过程, `createSagaMiddleware`这个中间件中我们该做什么呢? 从用法来看我们首先要给它添加一个`run`方法

```javascript
// 使用
const store = applyMiddleware(sagaMiddleware)(createStore)(reducer);
sagaMiddleware.run(rootSaga); 

// 添加 run方法
function createSagaMiddleware(){
  
  // applyMiddleware会把store传进来
  function sagaMiddleware({getState, dispatch}){


    function run(generator){
      let it = generator();
      function next(){
        let {value: effect, done} = it.next();
        if(!done){
          switch(effect.type){
            case 'TAKE':
            events.once(effect.actionType, next);
            break;
            case 'PUT':
            dispatch(effect.action)
            next();
          default:
          break;
          }
        }
      }
      next();
    }
    sagaMiddleware.run = run;

    return function(next){
      return function(action){
        return next(action);
      }
    }
  }

  return sagaMiddleware;
}
```

从这个中间件的定义能看出来redux处处充满着Currying的气息, 乍一看不好理解, 三个return到底在做什么, 其实就是相当于传了4个参数而已, 中间件模版写好了, 那么`createSagaMiddleware`要做些什么呢?



怎么写还是要看`applyMiddleware`是怎么用的,

```javascript

export function take(actionType){
  return {
    type: 'TAKE',
    actionType
  }
}

export function put(action){
  return {
    type: 'PUT',

  }
}

```


