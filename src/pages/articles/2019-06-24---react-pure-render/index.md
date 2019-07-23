---
title: 'react pure render'
date: '2019-06-24'
layout: post
draft: false
path: '/posts/react-pure-render'
category: 'React'
tags:
  -
description: ''
---

PureRender
首先 PureRender 的实现类似于 纯函数，同一函数，相同的输入必定产出相同的输出。

一般来说 React 的性能优化很多时候集中在 shouldComponentUpdate 这个方法上，通过比较两次的 state 和 props 来决定一个组件是否进行更新。

shouldComponentUpdate 存在的问题
如果在 shouldComponentUpdate 中进行深比较，代价比较大，比如：

shouldComponentUpdate(nextProps,nextState){
// isDeepEqual 是比较两个对象是否完全相等的方法
return isDeepEqual(this.state,nextState) && isDeepEqual(this.props, nextProps);
}
这个过程，如果 state 和 props 嵌套比较多，深比较一般又会采取递归方式，效率非常慢。

PureRender 的实现对 object 进行了浅比较，因此只是比较引用，而不是比较值。

它的比较方式如下：

function shallowEqual(obj, newObj){
if(obj === newObj){
return true;
}
const objKeys = Object.keys(obj);
const newObjKeys = Object.keys(obj);

    if(objKeys.length !== newObjectKeys.length){
        return false;
    }

    // 这个过程中 只需要比较 props 中每一个是否相等，不进行深比较
    return objKeys.every(key => { return newObj[key] === obj[key];})

}

使用 PureRender
使用 class 构建的组件，通过引入 react-addons-pure-render-mixin,并且在构造函数中，将组件的 shouldComponentUpdate 赋值为 PureRender.shouldComponentUpdate.bind(this)（需要为当前组件绑定该方法）即可。

如：

import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class MyComponent extends Component{
constructor(props){
super(props);
this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
}

}

优化 PureRender
有几种情况，无论 state 和 props 怎么变化，都会触发 PureRender 返回 true：

1、props 直接设置成字面量对象或数组
通过字面量构建对象，每次在进行比较的时候，这个字面量对象都是一个新的对象，引用也是与之前不同的。

这会导致一直在触发 PureRender 是 true。

最常见的情况如下：

<MyComponent style={{color:'#000000'}} />
上面对于 style 这个 prop 的设置是存在问题的，每次 style 这个对象其实都是新创建了一个新的对象。

如果进行默认值的配置，也可能导致这种情况的出现，如下：

<MyComponent name={this.props.name || {} } />
上面的组件中，如果 this.props 中没有 name ，则会给其一个默认的空对象，然而两次连续的空对象，也会导致 PureRender 返回 true。

解决上面这种问题的方法可以赋值一个对象，在使用的时候，都是用这个对象的引用即可：

const defaultObj = {};
<MyComponent name={this.props.name || defaultObj } />
2、将事件绑定移动到构造函数中
一般来说，可能习惯直接在事件 prop 上进行 this 的绑定，这也是我之前经常使用的方式，但是从优化的角度，放在放在构造函数中不需要每次都进行绑定。

两者优缺点共存，一方面，在 prop 上使用 bind 绑定 this ，可以额外的传递参数，而如果在构造函数中绑定，如果要额外传递参数，就需要抽象子组件或者是更改数据结构。

3、子组件导致 PureRender 每次都是 true
如果一个组件有子组件，则其 shouldComponentUpdate 每次都会返回 true。

import React, {Component} from 'react';

class NameItem extends Component {
render(){
<Item>
<span>Postbird</span>
</Item>
}
}
上面 <Item /> 的子组件 <span>Postbird</span> 通过 JSX 编译内容是：

<Item children={React.createElement('span',{},'Postbird')} />
所以 <Item /> 无论在什么情况下都会重新渲染。

如果要避免 Item 的重复渲染，可以给 NameItem 组件设置 PureRender ，也就是提到父级组件进行判断：

import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class NameItem extends Component{
constructor(props){
super(props);
this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
}
render(){
return(
<Item> <span> Postbird </span> </Item>
);
}
}
通过 PureRender 的浅比较策略（见上面），在进行前后比较的过程中，不会对 children={React.createElement('span',{},'Postbird')} 进行深比较，因此不会对 <Item/> 进行重复渲染。

Shallow Render

import ShallowRenderer from 'react-test-renderer/shallow'; // ES6

http://www.ptbird.cn/react-state-setState.html
http://www.ptbird.cn/react-life-cycle.html
http://www.ptbird.cn/react-v16-chinese.html

http://www.ptbird.cn/react-component-api-reference.html
http://www.ptbird.cn/reacr-top-level-api-refreence.html

http://www.ptbird.cn/react-render-props.html
http://www.ptbird.cn/react-portal-createPortal.html
https://usehooks.com/
https://medium.com/@as790726/%E5%A6%82%E4%BD%95%E9%8C%AF%E8%AA%A4%E5%9C%B0%E4%BD%BF%E7%94%A8-react-hooks-usecallback-%E4%BE%86%E4%BF%9D%E5%AD%98%E7%9B%B8%E5%90%8C%E7%9A%84-function-instance-7744984bb0a6
https://zhuanlan.zhihu.com/p/66166173
https://zhuanlan.zhihu.com/p/66170210
https://zhuanlan.zhihu.com/p/56975681
https://zhuanlan.zhihu.com/p/60925430
https://juejin.im/post/5c99a75af265da60ef635898
http://caibaojian.com/react-hooks.html
https://imweb.io/topic/5cf885926c3e7b4122e242fd
https://fettblog.eu/typescript-react/
https://medium.com/@mts40110/react-hooks-%E4%B8%80%E4%BA%9B%E7%B4%80%E9%8C%84-e5476075d9b8

https://pan.baidu.com/s/1pi1fuPR3iDuTbrvSJ-0eCQ#list/path=%2F2019%E9%87%8D%E6%96%B0%E6%95%B4%E7%90%86React%E6%95%99%E7%A8%8B%2F07.%E6%9F%90%E8%AF%BE%E7%BD%91React%20Native%E6%8A%80%E6%9C%AF%E7%B2%BE%E8%AE%B2%E4%B8%8E%E9%AB%98%E8%B4%A8%E9%87%8F%E4%B8%8A%E7%BA%BFAPP%E5%BC%80%E5%8F%91&parentPath=%2F
https://www.itread01.com/content/1548593908.html
https://medium.com/@yanglin_68397/react-hooks-api-%E4%B8%8D%E5%8F%AA%E6%98%AF-usestate-%E6%88%96-useeffect-57ebc46b3f61

https://jspang.com/posts/2019/03/01/flutter-shop.html
https://medium.com/crowdbotics/build-a-react-native-app-with-react-hooks-5498e1d5fdf6
https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/
https://www.taniarascia.com/content-editable-elements-in-javascript-react/
https://segmentfault.com/a/1190000014482093
