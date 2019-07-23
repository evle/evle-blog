---
title: "React Hook飞行手册"
date: "2019-06-23"
layout: post
draft: false
path: "/posts/react-hook"
category: "React"
tags:
  - React Hook
description: ""
---

## Why React Hook?

## 使用规则
1. 不要在循环、条件或者嵌套函数中调用 Hook
2. 只在 React Function 中使用 Hooks

npm install eslint-plugin-react-hooks@next

{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error"
  }
}


多个useState 和 useEffect 顺序问题




## API使用
迁移指引：
写Function Component快乐的飞起？ 所有参数都来自props 自身不需要维护状态没有state
那为什么function Component飞不动了？ 因为如果这个function component需要维护自己的状态
那就没有办法了 最简单的例子 做一个弹窗 Dialog

自身维护一下点击取消就是关闭 没办法了  这时候用useState

特性： 
1. 每次渲染都是独立的闭包
  

### useState



```javascript
const [state, setState] = useState(initialState);

// 改变state的值
setState(prevState => {
  return {...prevState, ...updatedValues};
});

// 延迟初始化
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### useEffect

```javascript
useEffect(didUpdate)

// 清理 effect
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // 清理订阅
    subscription.unsubscribe();
  };
});

// ComponentDidMount
useEffect(()=>{

}, [])


useLayoutEffect()
```

### useContext

```javascript
const context = useContext(Context);
```

### useReducer

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

延迟初始化
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    {type: 'reset', payload: initialCount},
  );


```

### useImperativeMethods
把自己的ref给父组件使用

```javascript
useImperativeMethods(ref, createInstance, [inputs])

function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeMethods(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

### useRef

```javascript
const refContainer = useRef(initialValue)

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

## useMemo
入参一个函数, 一个数组, 返回一个有记忆的值, 记忆的值怎么讲？只有[a,b]变化时候函数才会重新计算
输入数组不作为参数传递给回调。

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

## useCallback

```javascript
当将回调传递给依赖于引用相等性的优化子组件以防止不必要的 render ，比如（shouldComponentUpdate）的时候，这非常有用。

useCallback(fn, inputs) 等效于 useMemo(() => fn, inputs).



const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```


