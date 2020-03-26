---
title: "深入 Ant Design Button 内部原理 (翻译)"
date: "2019-07-23"
layout: post
draft: false
path: "/posts/translation-diving-into-antd-button"
category: "React"
tags:
  - Antd
description: ""
---

Ant Design是React生态中一个高质量的UI组件库, 本文带领大家深入了解最经典的Button在 Antd 中是如何实现的。

### handleClick

[![eAUpbn.md.gif](https://s2.ax1x.com/2019/07/23/eAUpbn.md.gif)](https://imgchr.com/i/eAUpbn)

首先让我们看一下按钮的点击事件处理函数`handleClick`

```javascript
handleClick = (e) => {
  this.setState({ clicked: true });
  clearTimeout(this.timeout);
  this.timeout = setTimeout(() => this.setState({ clicked: false }), 500);

  const onClick = this.props.onClick;
  if (onClick) {
    onClick(e);
  }
}
```

那么点击了按钮后发生了什么？

1. 设置内部的状态`clicked`为`true`
2. 开启了一个定时器, 0.5秒后将状态`clicked`设置为`false`, 用来re-render。
3. 清除之前的定时器
4. 如果给Button传递了参数`onClick`则在事件发生时, 调用`onClick`

### componentWillReceiveProps

[![eAUCEq.md.gif](https://s2.ax1x.com/2019/07/23/eAUCEq.md.gif)](https://imgchr.com/i/eAUCEq)

```javascript
componentWillReceiveProps(nextProps) {
  const currentLoading = this.props.loading;
  const loading = nextProps.loading;

  if (currentLoading) {
    clearTimeout(this.delayTimeout);
  }

  if (loading) {
    this.delayTimeout = setTimeout(() => this.setState({ loading }), 200);
  } else {
    this.setState({ loading });
  }
}
```

`componentWillReceiveProps`是用来当`props`变化时更新`state`的, 但可能即使`props`没有改变该生命周期函数也会被调用, 因此我们要确保对比以下`props`是否真的有变化。在Antd中给Button传递`loading`属性时, Button则会渲染一个转圈的等待动画, 当`this.props.loading`发生改变时对loading状态进行判断, 如果网络请求的回应小于200ms则不会渲染等待动画。

### componentWillUnmount

`componentWillUnmount`生命周期函数在组件将要销毁的时候被调用, 一般用于做一些清理工作比如清理定时器, 网络请求, 亦或者与其它库的交互。

```javascript
componentWillUnmount() {
  if (this.timeout) {
    clearTimeout(this.timeout);
  }
  if (this.delayTimeout) {
    clearTimeout(this.delayTimeout);
  }
}
```

Button中使用了`timeout`和`delayTimeout`2个定时器, `timeout`用于0.5秒后复位点击状态`clicked`, `delayTimeout`用于清理延时加载loading动画的定时器。

### Component description

Antd使用TypeScript开发, 通过interface我们可以对组件的使用进行约束, 可以帮助我们快速定位组件参数传递错误导致的Bug

```javascript
export interface ButtonProps {
  type?: ButtonType;
  htmlType?: string;
  icon?: string;
  shape?: ButtonShape;
  size?: ButtonSize;
  onClick?: React.FormEventHandler<any>;
  onMouseUp?: React.FormEventHandler<any>;
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
}

export default class Button extends React.Component<ButtonProps, any> {
}
```

这似乎与`PropTypes`的检测重复了

```javascript
export default class Button extends React.Component<ButtonProps, any> {
  static propTypes = {
    type: React.PropTypes.string,
    shape: React.PropTypes.oneOf(['circle', 'circle-outline']),
    size: React.PropTypes.oneOf(['large', 'default', 'small']),
    htmlType: React.PropTypes.oneOf(['submit', 'button', 'reset']),
    onClick: React.PropTypes.func,
    loading: React.PropTypes.bool,
    className: React.PropTypes.string,
    icon: React.PropTypes.string,
  };
```

原文链接: [Diving into ant-design internals: Button](https://reactkungfu.com/2017/03/diving-into-ant-design-internals-button/)


