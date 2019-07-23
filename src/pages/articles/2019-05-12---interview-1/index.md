---
title: "面试题分析"
date: "2019-05-12"
layout: post
draft: true
path: "/posts/interview-1"
category: "Interview"
tags:
  - Interview
description: ""
---

https://github.com/alibaba/dawn
<script>
  let stock = '1 lemon, 2 cabbages, and 101 eggs';
  function minusOne(match, amount, unit) {
    amount = Number(amount) - 1;
    if (amount == 1) {
      // only one left, remove the 's'
      unit = unit.slice(0, unit.length - 1);
    } else if (amount == 0) {
      amount = 'no';
    }
    return amount + ' ' + unit;
  }
  console.log(stock.replace(/(\d+) (\w+)/g, minusOne));

  function parseINI(string) {
    // Start with an object to hold the top-level fields
    let result = {};
    let section = result;
    string.split(/\r?\n/).forEach(line => {
      let match;
      if ((match = line.match(/^(\w+)=(.*)$/))) {
        section[match[1]] = match[2];
      } else if ((match = line.match(/^\[(.*)\]$/))) {
        section = result[match[1]] = {};
      } else if (!/^\s*(;.*)?$/.test(line)) {
        throw new Error("Line '" + line + "' is not valid.");
      }
    });
    return result;
  }

  console.log(
    parseINI(`
name=Vasilis
[address]
city=Tessaloniki`),
  );
  class Analysis {
    constructor() {
      this.totalNode = document.getElementsByTagName('*').length;
      this.maxChild = 0;
      this.stack = [];
      this.last = 1;
      this._deepWalk(document.getElementsByTagName('html')[0]);
      this.depth = Math.max.apply(Math, this.stack);
    }

    _deepWalk(node) {
      if (node.children.length > this.maxChild) {
        this.maxChild = node.children.length;
      }
      if (node.parentElement) {
        this.last++;
      }
      if (node.children.length == 0) {
        this.stack.push(this.last);
        this.last = 1;
      }

      if (node.children.length) {
        Array.from(node.children).forEach(el => this._deepWalk(el));
      }
    }

    getData() {
      return {
        totalElementsCount: this.totalNode,
        maxDOMTreeDepth: this.depth,
        maxChildrenCount: this.maxChild,
      };
    }
  }

  var analysis = new Analysis();
  let analyticsData = analysis.getData();

  window.addEventListener('unload', logData, false);

  function logData() {
    navigator.sendBeacon('/serverAddr', JSON.stringify(analyticsData));
  }
</script>

1. 什么时候用rebase 什么时候用merge
merge是把多次历史记录合并到一起 git pull会默认进行一次merge
多brach时候合并造成了必须将不必要的分支交汇, 但是目的是避免最终的merge conflict
rebase是改变branch out, 多次解决同一个地方的冲突
私有分支 个人开发的分支 rebase 
多人协作 merge
Trunk Based Development: rebase

2. 什么情况下你会使用 translate() 来替代绝对定位？

3. CSRF 跨站伪造
用户访问A得到cookie, 访问B, B通过用户发送请求给A, A无法分辨是用户还是B
4. XSS 跨站脚本
过滤innerText 转义非法

5. Axios jquery fetch选型
Axios服务器和浏览器都用, 拦截器, 取消请求, 跨站验证
拦截器场景：refresh token & access token
原理: 到use就预感是中间件, 然后果然内部维护了一个chain的数组 每次use时把push, 然后一个chain.length
不等于0的条件循环 去调用回调。
fecth: ES新规范 兼容性, 默认不带cookie, 无法检测请求进度, 400 500都当作成功
400请求无效有可能格式不对 401没授权 403 请求但拒绝执行

6. Promise实现 状态不能改
Promise.resolve(data)等于new Promise(resolve=>{resolve(data)})
Promise A可以使用另一个Promise B的resolve值作为自己的resolve值进入A的调用链

Promise.all


7. http2 http3


8. Object.getOwnPropertyDescriptor
defineporperty时候 全是flase
返回对象描述： value writeable冻结对象 enenumerable forin object.keys configurable修改或者删除 delete
主要是为了解决Object.assign()无法正确拷贝get属性和set属性 是undefined
配置defineProperties
const shallMerge = (target,source) => Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));

9 React HOC


10 react 单向数据流
简单的单向数据流（unidirectional data flow）是指用户访问View，View发出用户交互的Action，在Action里对state进行相应更新。state更新后会触发View更新页面的过程。这样数据总是清晰的单向进行流动，便于维护并且可以预测。


react事件
React为什么要自己实现一个事件系统？性能和复用 和兼容（native以及不同浏览器）
DOM结点插入原生事件监听 会绑定和删除大量 所以事件代理document绑定通过 event target




10. Redux 中的 reducer 传入一个拷贝一份 state 数据是最佳实践，如果不这样做，会发生什么？为什么

11. 线上debug 
chrome调试 webpack压缩时候生成 sourcemap chrome添加进去就好了

12. getProperty({a: 1, b: 2}) -> [['a', 1], ['b', 2]] 
function getProperty(obj){
	let stack = [];
	Object.keys(obj).forEach(el=>{
	stack.push([el, obj[el]]);
    })
return stack;
}

13. 去重
function duplicate(arr){
	return [... new Set(arr)]
};

function duplicate(arr){
	var obj = {};
	arr.forEach(el=>{
	obj[el] = el
}	)

return Object.keys(obj)
  }
  
  function w(arr){
    let stack = [];
  
    arr.forEach(el=>{
    if(!stack.includes(el)){
      stack.push(el)
  }
  })
  
  return stack
  }

  14. 实现一个swiper

  15. tansiate代替 left top好处
浏览器绘制DOM：
获取 DOM 并将其分割为多个层（layer）
将每个层独立地绘制进位图（bitmap）中
将层作为纹理（texture）上传至 GPU
复合（composite）多个层来生成最终的屏幕图像。

left/top/margin 之类的属性会影响到元素在文档中的布局，浏览器将整层放在GPU进行计算
transform 属于合成属性（composite property, 独立复合层 元素内容没有改变，层不会reflow
重新复合
 





  16. 使用缓存解决js递归调用性能问题

  17. react setState合并 以及触发流程
异步操作： 每次调用setState都会触发更新，异步操作是为了提高性能，将多个状态合并一起更新，减少re-render调用，
 想立即拿到值  setState 回调 类似reduce
this.setState( prevState => {
  console.log( prevState.num );
  return {
      num: prevState.num + 1
  }
} );


实现1. 合并state
用队列把变化的state和组件存起来
清空队列后渲染  关键点是什么时候清空队列?事件循环机制
 if ( queue.length === 0 ) {
        defer( flush );
    }
    function defer( fn ) {
    return Promise.resolve().then( fn );
}

第二种实现 setTimeout16ms
16毫秒的间隔在一秒内大概可以执行60次，也就是60帧，人眼每秒只能捕获60幅画面



1. 渲染组件不能在队列循环时渲染, 同一个组件被添加多次性能问题

组件队列
```javascript
const queue = [];
const renderQueue = [];
function enqueueSetState( stateChange, component ) {
    queue.push( {
        stateChange,
        component
    } );
    // 如果renderQueue里没有当前组件，则添加到队列中
    if ( !renderQueue.some( item => item === component ) ) {
        renderQueue.push( component );
    }
}
```


```javascript
function flush() {
    let item;
    // 遍历
    while( item = setStateQueue.shift() ) {

        const { stateChange, component } = item;

        // 如果没有prevState，则将当前的state作为初始的prevState
        if ( !component.prevState ) {
            component.prevState = Object.assign( {}, component.state );
        }

        // 如果stateChange是一个方法，也就是setState的第二种形式
        if ( typeof stateChange === 'function' ) {
            Object.assign( component.state, stateChange( component.prevState, component.props ) );
        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            Object.assign( component.state, stateChange );
        }

        component.prevState = component.state;

    }
     while( component = renderQueue.shift() ) {
        renderComponent( component );
    }
}
```



1. 解决异步更新问题




  1.  const s = '3[a]2[bc]'; decodeString(s); // 返回'aaabcbc'
  * const s = '3[a2[c]]'; decodeString(s); // 返回'accaccacc'
  * const s = '2[abc]3[cd]ef'; decodeString(s); // 返回'abcabccdcdcdef'

  19. 示例：
  * ”abcabcbb", 其无重复字符的最长子字符串是'abc'，其长度是3
  * “bbbbb", 其无重复字符的最长子字符串是‘b'，其长度是1



20 基于React框架的优化
{...this.props} 不滥用  加重 shouldComponentUpdate比较负担
this.handleChange() bind一律在construor不然每次都会bind
map里面添加key，并且key不要使用index（可变的）
尽量少用setTimeOut或不可控的refs、DOM操作
使用return null而不是CSS的display:none
shouldComponentUpdate中使用 Immutable来更小粒度控制更新
重复渲染的问题
why immutable？本身就能生成不可变的数据 无需deepCopy
Immutablejs本身就能生成不可变数据，这样就不需要开发者自己去做数据深拷贝，可以直接拿prevProps/prevState和nextProps/nextState来比较。
Immutable本身还提供了数据的比较方法，这样开发者也不用自己去写数据深比较的方法
路由控制与拆包 惰性加载 require.ensure 异步加载

react优化本质 1.render function 2. virtual DOM diff
保持virtual DOM一致 父state变化 子render被调用 但也不会重新渲染 因为DOMdiff
但是dom diff需要时间 所以就不触发 render function, shouldcompoentUpdate return false
但是 如果遇到有引用的时候 判断state shallowEqual只比较一层 性能
PureComponent 就是帮判断一层 但要注意更新时候
this.setState({
  obj: {
    ...this.state.obj,
    id: 2
  }
})
  
this.setState({
  list: [...this.state.arr, 123]
})
这样才生效



  




21 React Hooks



22 FCM原理 2个流程
1. 客户端应用程序与 FCM 以获取将发件人 ID、 API 密钥和应用程序 ID 传递到 FCM 的注册令牌。
2. FCM 返回到客户端应用程序注册令牌。
3. 客户端应用程序 （可选） 将转发到应用服务器的注册令牌。

1.应用程序服务器将消息发送到 FCM。
2.如果客户端设备不可用，FCM 服务器以在稍后传输队列中存储消息。 最多 4 周的 FCM 存储中保留消息 (有关详细信息，请参阅设置一条消息的生命期)。
3.当客户端设备可用时，FCM 将转发到该设备上的客户端应用的消息。
4.客户端应用程序接收来自 FCM 的消息、 处理，并为用户显示。 例如，如果消息是远程通知，则将它显示给通知区域中的用户。


13 CSS盒子模型 水平垂直居中的问题
IE border-box
标准 content-box

\1必须与小括号配合使用。
正则表达式匹配重复 /(.)\1+/g  分组中重复的
\1 是对(\w)的一个实例化引用, 当(\w) 匹配到A时, \1 被表达成A, 当(\w)匹配9时, \1 被表示成9
http://www.aijquery.cn/Html/jqueryjiqiao/181.html

14. ajax readyState 0-4 初始化到完成 fetch不可以



15. 实现一个event bus


var list = document.getElementsByTagName('li');

  for (var i = 0; i < list.length; i++) {
    var printList = (function(i) {
      return function() {
        console.log(i);
      };
    })(i);

    list[i].addEventListener('click', printList, false);
  }

16. 缓存 强expire/cache-control  鞋穿上etag/last

17 错误优先 fs.readFile(filePath, function(err, data)

18. .WeakMap 和 Map 的区别? wekak避免内存泄漏 weakmap接收对象作为key
19. 数据劫持 MVVM实现
解析模版 比如v-model这种 {{}} 先遍历DOM

解析数据 定义数据变动时要通知的对象。解析数据时应保证数据解析后的一致性，对于每种数据解析后暴露的接口应该保持一致。

绑定模版与数据
这一部分定义了数据结构以何种方式和模版进行绑定，就是传说中的“双向绑定

劫持修改数据 后调用回调


```javascript
function bindData(obj, fn) {
  for (let key in obj) {
    Object.defineProperty(obj, key, {
      set(newVal) {
        if (this.value !== newVal) {
          this.value = newVal;
          fn.call(obj, key);
        }
      },
      get() {
        return this.value;
      }
    })
  }
}
```

20 CommonJS 中的 require/exports 和 ES6 中的 import/export 区别？
　CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。


　ES6模块是动态引用，如果使用import从一个模块加载变量，那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。


1.  继承

```javascript
function People(name,age){
     this.name=name;
     this.age=age;
     this.say=function(){
         console.log("我的名字是:"+this.name+"我今年"+this.age+"岁！");
     };
}
function Child(name, age){
    People.call(this);
    this.name = name;
    this.age = age;
}
Child.prototype = Object.create(People.prototype);
Child.prototype.constructor = Child;
var child = new Child('Rainy', 20);
child.say()
```

22.  关系型数组转换成树形结构对象
var obj = [
    { id:3, parent:2 },
    { id:1, parent:null },
    { id:2, parent:1 },
]

o = {
  obj: {
    id: 1,
    parent: null,
    child: {
      id: 2,
      parent: 1,
      child: {
          id: ,3,
          parent: 2
      }
    }
  }
}





1.  react key原理
react唯一标识元素的, 用在vitrualDOM比较时候 key值相同则更新 如果key不同就可以删掉了 重新创建




2.  callback
3.  highOrder
```javascript
// 判断类型 Object.prototype.toString.call();
function isType(type){ // type  == 'boolean'
  return function (obj){
    return Object.prototype.toString.call(obj).includes(type);
  }
}
// 包装成一个高阶函数 批量生成函数  
let types = ['String','Object','Array','Null','Undefined','Boolean'];
let fns = {};
types.forEach(type=>{ // 批量生成方法
    fns['is'+type] = isType(type)
})
let a = true;
console.log(fns.isString(a)); // 函数柯里化 // 偏函数
```

27. 条件流程 map／object > switchcase > if else
const obj = {
	1: () => {},
	2: () => {},
	3: () => {},
}
obj[type]()

const map = new Map([
	[1, () => {}],
	[2, () => {}],
	[3, () => {}],
])
map.get(type)()

28. 减少 cookie 体积: 能有效减少每次请求的体积和响应时间；
去除不必要的 cookie；
压缩 cookie 大小；
设置 domain 与 过期时间；

29. dom 优化:
减少访问 dom 的次数，如需多次，将 dom 缓存于变量中；
减少重绘与回流:
多次操作合并为一次；
减少对计算属性的访问；
例如 offsetTop， getComputedStyle 等
因为浏览器需要获取最新准确的值，因此必须立即进行重排，这样会破坏了浏览器的队列整合，尽量将值进行缓存使用；
大量操作时，可将 dom 脱离文档流或者隐藏，待操作完成后再重新恢复；
使用DocumentFragment / cloneNode / replaceChild进行操作；
使用事件委托，避免大量的事件绑定；

html 优化:
减少DOM数量
<img src="" />不要这个 也会发请求
图片提前 指定宽高 或者 脱离文档流，能有效减少因图片加载导致的页面回流；
减少使用 table 进行布局，避免使用<br />与<hr />； 

首屏优化
合理利用 Localstorage / server-worker 等存储方式进行 数据与资源缓存；
使用dns-prefetch / preconnect / prefetch / preload等浏览器提供的资源提示，加快文件传输；
非关键性的文件尽可能的 异步加载和懒加载，避免阻塞首页渲染；
css / js 分割，使首屏依赖的文件体积最小，内联首屏关键 css / js；
服务端渲染(SSR):
减少首屏需要的数据量，剔除冗余数据和请求；
控制好缓存，对数据/页面进行合理的缓存；
页面的请求使用流的形式进行传递；
体验
利用一些动画 过渡效果，能有效减少用户对卡顿的感知；
尽可能利用 骨架屏(Placeholder) / Loading 等减少用户对白屏的感知；
js 执行时间避免超过 100ms，超过的话就需要做:
寻找可 缓存 的点；
任务的 分割异步 或 web worker 执行；

30  get post 区别以及get请求传参长度的误区
浏览器决定长度
get不用每次与服务器连接 使用缓存
post不同 不能使用缓存


31. 闭包
闭包就是能够读取其他函数内部变量的函数，或者子函数在外调用，子函数所在的父函数的作用域不会被释放。
内存泄漏
var a="hello world";
var b="world";
var a=b;
//这时，会释放掉"hello world"，释放内存以便再引用

标记位： 给所有内存分配的加标记，然后去除 1.环境变量中的 2.引用到的标记 剩下没有有标记则回收
引用计数： 不常见 引用次数0 存在内存泄漏在互相引用的时候
var element=document.getElementById（’‘）；
var myObj=new Object();
myObj.element=element;
element.someObject=myObj;

32。 mouseover & mouseenter
mouseover冒泡 移动入出 子元素会发生
mouseenter不冒泡 是自己

33. new
- {}
- prototype指向函数
- 执行构造函数后返回这个对象

34. apply call bind

35. 前端工程化 思想纬度提高 站在工程的角度考虑 
- 技术选型
- 定制规范
- 模块分隔
- 性能优化
- 加载资源
- 集成 & 部署

36. 一部分加载JS
async属性或者创建script标签插入到DOM

37. ajax解决缓存： 变化URL 时间戳或者随机数

38. 节流和防抖

throttle原理：当前事件 - 上一次时间  获取事件过了几秒, 如果>= 指定的 则调用
debounce原理：定时器延时执行, 如果期间有 则取消之前一次的 无限滞后

 fn是我们需要包装的事件回调, interval是时间间隔的阈值
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0
  
  // 将throttle处理结果当作函数返回
  return function () {
      // 保留调用时的this上下文
      let context = this
      // 保留调用时传入的参数
      let args = arguments
      // 记录本次触发回调的时间
      let now = +new Date()
      
      // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
      if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
          last = now;
          fn.apply(context, args);
      }
    }
}

// 用throttle来包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)


// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间
function debounce(fn, delay) {
  // 定时器
  let timer = null
  
  // 将debounce处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments

    // 每次事件被触发时，都去清除之前的旧定时器
    if(timer) {
        clearTimeout(timer)
    }
    // 设立新定时器
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

// 用debounce来包装scroll的回调
const better_scroll = debounce(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)


// fn是我们需要包装的事件回调, delay是时间间隔的阈值
function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0, timer = null
  // 将throttle处理结果当作函数返回
  
  return function () { 
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()
    
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
    // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
       clearTimeout(timer)
       timer = setTimeout(function () {
          last = now
          fn.apply(context, args)
        }, delay)
    } else {
        // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
        last = now
        fn.apply(context, args)
    }
  }
}

// 用新的throttle包装scroll的回调
const better_scroll = throttle(() => console.log('触发了滚动事件'), 1000)

document.addEventListener('scroll', better_scroll)

惰性加载图片
innerHeight - el.getBoundingClientRect().top

1.  eval newFunction Constructor 解析字符串到JS语法 然后执行 耗时
  
2.  深浅克隆 
function deepClone(obj){
  var newObj= obj instanceof Array ? []:{};
  for(var item in obj){
    var temple= typeof obj[item] == 'object' ? deepClone(obj[item]):obj[item];
    newObj[item] = temple;
  }
  return newObj;
} 

41. once
function ones(func){
    var tag=true;
    return function(){
      if(tag==true){
        func.apply(null,arguments);
        tag=false;
      }
      return undefined
    }
}


42. Ajax封装成promise
var  myNewAjax=function(url){
  return new Promise(function(resolve,reject){
      var xhr = new XMLHttpRequest();
      xhr.open('get',url);
      xhr.send(data);
      xhr.onreadystatechange=function(){
           if(xhr.status==200&&readyState==4){
                var json=JSON.parse(xhr.responseText);
                resolve(json)
           }else if(xhr.readyState==4&&xhr.status!=200){
                reject('error');
           }
      }
  })
}

43. js监听对象属性的改变
Object.defineProperty：   监听的不在对象里 无法监听
Proxy

44. 实现私有变量
defineProperty 默认全false
obj={
  name:yuxiaoliang,
  getName:function(){
    return this.name
  }
}
object.defineProperty(obj,"name",{
   //不可枚举不可配置
});
用对象
function product(){
    var name='yuxiaoliang';
    this.getName=function(){
      return name;
    }
}
var obj=new product();

45. setTimeout、setInterval和requestAnimationFrame之间的区别
1. requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率。
2. 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的CPU、GPU和内存使用量
3. requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。


46. 实现sleep promise
    function sleep(ms){
  var temple=new Promise(
  (resolve)=>{
  console.log(111);setTimeout(resolve,ms)
  });
  return temple
}
sleep(500).then(function(){
   //console.log(222)
})
//先输出了111，延迟500ms后输出222

47. 图片一张加载完再一张
var obj=new Image();
obj.src="http://www.phpernote.com/uploadfiles/editor/201107240502201179.jpg";
obj.onload=function(){
alert('图片的宽度为：'+obj.width+'；图片的高度为：'+obj.height);
document.getElementById("mypic").innnerHTML="<img src='"+this.src+"' />";
}

48. 移动端300ms延迟
检测到touchend, 立即出发click事件，把浏览器300ms后的取消掉

49 REST
用URL定位资源， 用HTTP描述操作

50. cookie和session区别
HTTP无状态, cookie最大作用存sessionID 来给用户唯一标识

51. .Cookie如何防范XSS攻击
set-cookie=secure https才发送 httponly 禁止JS操作cookie

52. fetch发送2次请求的原因
fetch发送post请求的时候，总是发送2次，第一次状态码是204，第二次才成功？
fetch先发OPtion询问服务器是否支持修改请求头


53. CMD AMD UMD ES6
最早模块： IIFE 里面通过window.xxx 暴露接口
(function (window,$) {
})(window,jQuery)
缺点引用多个文件分不清楚依赖

common js: 同步加载，有缓存 
module.exports和exports的区别： 保持联系的 exports指向新的对象了 
amd: 异步加载 有缓存
cmd 异步加载 有缓存
es6 动态引用 没缓存

54. React对事件的处理
React 将使用单个事件监听器监听顶层的所有事件。这对于性能是有好处的，这也意味着在更新 DOM 时，React 不需要担心跟踪事件监听器。

55. React 中 refs 的作用是什么？
直接操作DOM
 ref={(input) => this.input = input} />

56. 怎么阻止组件的渲染
在组件的 render 方法中返回 null 并不会影响触发组件的生命周期方法

57. React中如何定义初始状态 ？
State和Props
组件的State属性在生命周期函数 getInitialState中初始化

58. JSX的有什么优点
速度快优化 类型安全 开发效率高

59. 创建虚拟DOM
 Var  Com=React.createClass({render(){return ()}})

 60. 有状态和无状态两种形式的组件：
  Stateless Component（无状态组件）只有props没有state

  61. 为什么选择在componentDidMount函数中来执行ajax异步请求？
  在componentWillMount改变state将不会引起rerenering，cunstructor也能起到同样的作用

62.实现Promise

63.浏览器Eventloop和node有什么区别
timer IO idel poll check close callback


64.
前端工程化
凡是重复的，必须使用工具自动完成。
工具众多，我们就有一种想法，能不能有一种工具能帮我们自动生成雪碧图、 css压缩、图片压缩等等，然后就出现了前端工程化。前端工程化一般可分为五个步骤：
（1） 初始，生成基础目录结构和样式库。
（2） 开发，实时预览、预编译。
（3） 构建，预编译、合并、压缩。
（4） 发布，将构建后静态文件发布上线。ddd
（5） 打包，资源路径转换，源码打包 。
把问题理解清楚，确保将要写的代码能真正的解决问题

缓存策略
If-Modified-Since  stat.mtime.toUTCString()
Etag & If-None-Match md5生成
减少cookie大小 会放请求里面
减少DNS请求 dns-prefetch 
在一个网站里面使用至少2个域，但不多于4个域
根据域名划分内容
因为一个域名下链接数量有上线
document.getElementsByTagName('*').length 优化DOM数量
favicon.ico 过期长存在 小

浏览器5个线程
1. GUI渲染线程 解析HTMLCSS布局绘制
2. JS 引擎线程 执行JS代码 阻塞页面
3. 定时器触发 线程  时间到了加入事件队列等JS引擎执行
4. 事件触发 线程 
5. 异步HTTP请求线程 负责异步请求函数

 JS 去给 DOM 分压。
重绘不一定导致回流，回流一定会导致重绘。
DOM优化 将DOM离线 display none
CSS优化  合并样式

 同步任务 | 微任务promise   |  宏任务


webpack原理
1. 解析webpack配置参数，合并从shell传入和webpack.config.js文件里配置的参数，生产最后的配置结果。
2.  注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
3.  从配置的entry入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。
4. 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
5. 递归完后得到每个文件的最终结果，根据entry配置生成代码块chunk。
6. 输出所有chunk到文件系统。
webpack核心
optimization.splitChunks
optimization.runtimeChunk

优化
resolve 查找路径快点
使用DllPlugin减少基础模块编译次数
2.loader 合理的设置 include & exclude
Happypack
externals: {   发布到CDN
DefinePlugin
webpack-bundle-analyzer

HotModuleReplacementPlugin 会暴露一个module.hot 
accept 监控哪些模块 在回调中 卸载 在挂载

单页应用问题 一个页面复杂
1将网站功能按照相关程度划分成几类
2每一类合并成一个Chunk，按需加载对应的Chunk
3例如，只把首屏相关的功能放入执行入口所在的Chunk，这样首次加载少量的代码，其他代码要用到的时候再去加载。最好提前预估用户接下来的操作，提前加载对应代码，让用户感知不到网络加载

从项目结构着手，代码组织是否合理，依赖使用是否合理；
从webpack自身提供的优化手段着手，看看哪些api未做优化配置；
从webpack自身的不足着手，做有针对性的扩展优化，进一步提升效率；



难点：
1. 就是解决webRTC中dataChannel数据传输的大小和速度问题
2. 写混淆器 过审核

快速排序 原理：递归排序 找到中间 排左右的模式
1. 取出中间时 要去除中间 从原数组
2. 限定条件 当arr.length <=1 返回arr

 var sort1 = function (arr) {

    if (arr.length <= 1) {
      return arr;
    }

    var pivotIndex = Math.floor(arr.length / 2);

    var pivot = arr.splice(pivotIndex, 1)[0];

    var left = [];

    var right = [];

    for (var i = 0; i < arr.length; i++) {

      if(arr[i] > pivot){
          right.push(arr[i])
      }else{
        left.push(arr[i])
      }
    }

    return sort1(left).concat([pivot], sort1(right))
  };

神拷贝
function deepClone(initalObj, finalObj) {    
  var obj = finalObj || {};    
  for (var i in initalObj) {        
    var prop = initalObj[i];        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {            
      continue;
    }        
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : {};            
      arguments.callee(prop, obj[i]);
    } else {
      obj[i] = prop;
    }
  }    
  return obj;
}

前拷贝 & ... & JSON.parse(JSON.stringify(object))
Object.assign(obj1, obj2)





1.  performance API
2.  const timing = window.performance.timing
// DNS查询耗时
timing.domainLookupEnd - timing.domainLookupStart
  
// TCP连接耗时
timing.connectEnd - timing.connectStart
 
// 内容加载耗时
timing.responseEnd - timing.requestStart

// firstbyte：首包时间	
timing.responseStart – timing.domainLookupStart	

// fpt：First Paint Time, 首次渲染时间 / 白屏时间
timing.responseEnd – timing.fetchStart

// tti：Time to Interact，首次可交互时间	
timing.domInteractive – timing.fetchStart

// ready：HTML 加载完成时间，即 DOM 就位的时间
timing.domContentLoaded – timing.fetchStart

// load：页面完全加载时间
timing.loadEventStart – timing.fetchStart



实现一个EventBus
https://github.com/Gozala/events/blob/master/events.js


generator Lazy Evaluation

特点
1. * 定义
2. yield 内部
3. next 调用


function *helloworldGenerator(){
  yield 'hello'
  yield 'world'
  return 'end'
}


var gen = helloworldGenerator();
gen.next();
gen.next();
gen.next();
gen.next();

next原理：
1. 遇到yield 暂停, 将yield后的表达式作为返回对象的value
2. 下一次next往下执行 直到遇到下一个yield

浏览器如何渲染HTML CSS
处理 HTML 标记并构建 DOM 树
处理 CSS 标记并构建 CSSOM 树
将 DOM 与 CSSOM 合并成一个渲染树
根据渲染树来布局，计算每个节点的几何信息，再将各个节点绘制到屏幕上

sass bem

.block{} //區塊 (Block)
.block__element{} //元素 (Element)
.block--modifier{}//修飾符（Modifier）

什么时候不使用
如果可以獨立成為一個class，具有複用性


git
1. 代码记录
2. 协作

分支 默认创建后是master branch

移动端布局
viewpoint
布局view point: 960px;
视觉 view point:  375px;
让它们相等



适配方式：
1 百分比 高度钉死 宽度计算百分比
2 em  父亲 fontsize * xem；
3 rem  html fz * rem

最小12px  先用iphone6布局


react+ typescript开发应用

定义任何数据 都要定义类型 比如
比如定义一个 [{id:1, name="max"},{id:2, name='evle'},{id:3, name="sangwoo"}]

export interface IUser {
  id: number,
  name: string
}

export const users:IUser[] = {
  {id:1, name="max"},{id:2, name='evle'},{id:3, name="sangwoo"}
}

如果外面要用的时候
import { IUser, users } from "./UserData";

新建一个state Component时候, 要定义起状态
interface Isate{
  products: IProducts
}

class ProductsPage extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      products: [] 如果这里我们用了一个状态 那么 就要在上面定义这个数据的interface
    };
  }