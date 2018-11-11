---
title: "JavaScript Developer的自我修养之 Clean Code(1)"
date: "2018-11-10"
layout: post
draft: false
path: "/posts/js-7"
category: ""
tags:
  - 
description: ""
---

## 写在前面的

> “Programming is the art of telling another human what one wants the computer to do”. — Donald Knuth

本篇是 JavaScript Developer的自我修养系列第一课: Clean Code. 每个人都会编程, 程序只是特定的语法与逻辑思考的一种结合, 是我们绝大部分人与生俱来的能力. 但写出优雅的代码却是一项需要刻意练习的事情. 工作内容的关系, 我的大部分时间都在写 **无法直视** 的混淆代码, 并且一直没有机会使用ES6的新特性, 也没使用linter规范自己的代码. 现在打算辞职去做自己喜欢的事情, 第一步就是先提升自己代码的可阅读性, 于是有了本篇文章. 当然本篇不仅仅是一份代码规范说明, 而是与大家一起探讨如何写健壮, 可拓展, 复用性强的代码.

本文提到的代码风格来自 Airbnb JavaScript Style Guide 与Ryan Mcdermott的 Clean Code for JavaScript.

## 变量

在JS中, 变量可以分为两类: **Primitives** 和 **complex** 类型变量.  

Primitives变量包括:`string`, `number`, `number`, `boolean`, `null` 等.  

Complex变量包括: `object`, `array`, `function`.  

访问`Primitives`类型的变量时, 我们操作的是她的值, 访问`Complex`变量时操作的是她的引用, 举个例子

```javascript
let a = 10;
a = 5;
console.log(a); // output: 5

let arr = [1, 2, 3];
let newArr = arr;
newArr.push(4);
console.log(arr); // output: [1,2,3,4]

let str = 'hello';
str[0] = 'x';
console.log(str); // 'hello'
```

从上面例子可以看出, 可以直观的看出 `Primitives` 类型 与 `Complex` 类型的区别, 我们将`arr`赋值给
`newArr`相当于 `newArr`引用了`arr`而不是新的值, 因此我们对 `newArr`的改变会造成 `arr`的改变. 对于操作这种引用很容易产生 side effect.
我们后面再详细的说明.

除此之外我们可以看到JS中的`string`类型是无法改变的, 所以我们要改变`string`的时候可以通过 `slice`等字符串处理函数修改并返回一个新的字符串.

## 对象

ES6为对象提供两一系列的便利的特性, 因此在操作对象的时候, 我们应该杜绝使用旧的语法操作对象来使代码更加简洁.  

### 定义对象

```javascript
const name = 'evle';

`❌`
var obj = {
  name: name,
  getAge: function(){
    return 10;
  }
}

`💋`
var obj = {
  name,
  getAge(){
    return 10;
  }
}
```

有时我们要检查一个对象是否有指定的属性, 我们通常会直接 `obj.hasOwnProperty('name')`, 但这样做是有隐患的, 比如如果对象是null. 这会引发
一个错误. 为了提升代码的健壮性我们应该使用如下的方式

```javascript
const has = Object.prototype.hasOwnProperty;
console.log(has.call(obj, 'name')) // true
```

### 浅拷贝(shallow-copy)对象

使用 Destructing 我们可以使浅拷贝更加简洁

```javascript
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 });

`✨`
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 };  // copy => { a: 1, b: 2, c: 3 }
```

### 访问对象

当访问对象的多个属性时，我们应该使用 Destructing.

```javascript
var user = {
  name: 'evle',
  age: 12
}

`❌`
let name = user.name
let age = user.age

`🍭`
let {name, age} = user;

`❌`
function getFullName(user){
  let firstName = user.firstName;
  let lastName = user.lastName;
  return `${firstName} ${lastName}`;
}

`💋`
function getFullName({ firstName, lastName }){
  return `${firstName} ${lastName}`;
}
```

### 对象作为返回值

在JS中, 我们可以通过返回数组或者对象实现函数返回多个返回值, 但是使用数组返回时候我们需要考虑数据的位置, 因此在返回值的时候, 我们统一使用 object destructuring返回多个值.

```javascript
function processInput(input) {
  // ...
  return { left, right, top, bottom };
}

const { left, top } = processInput(input);
```

## 类

过去我们通常使用`prototype`实现面向对象的特性. 但现在我们应该使用`class` 和 `extends`.

```javascript
  class Queue {
  constructor(contents = []) {
    this.queue = [...contents];
  }
  pop() {
    const value = this.queue[0];
    this.queue.splice(0, 1);
    return value;
  }
}
class PeekableQueue extends Queue {
  peek() {
    return this.queue[0];
  }
}
```

### 实现链式调用

在使用一些库的时候我们经常会看到链式调用, 这种调用方式优雅且易读, 所以我们在创建类的时候也应该返回`this`以实现链式调用

```javascript
class Jedi {
  jump() {
    this.jumping = true;
    return this;
  }

  setHeight(height) {
    this.height = height;
    return this;
  }
}

const luke = new Jedi();
luke.jump()
  .setHeight(20);
```

### Single Responsibility Principle

一个函数只做一件事情, 类也因该如此, 不要把不相关的功能都写在一个函数中或者类中, 这会极大的降低代码的灵活性, 和可扩展性.
下面的代码中, `UserSettings` class 包含了 **更改设置** 和 **验证授权** 两个功能, 我们需要将它分离出来.

```javascript
class UserSettings {
  constructor(user) {
    this.user = user;
  }

  changeSettings(settings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}

// Refactoring

class UserAuth {
  constructor(user) {
    this.user = user;
  }

  verifyCredentials() {
    // ...
  }
}


class UserSettings {
  constructor(user) {
    this.user = user;
    this.auth = new UserAuth(user);
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

### 保持接口简洁

曾经听过有人封装的函数要传7个参数, 甚至很多参数都不相关也必须传. 重点是这人还觉得自己代码写的好, 但其实给接口的使用者提供的简直是灾难.
另附一个界定代码好坏最简单的公式: `好的代码 = WTF/minutes` 值越小越好  

在设计接口的时候, 如果有很多参数不是必须的参数, 我们可以将其设计成可选参数如下：

```javascript
class DOMTraverser {
  constructor(settings) {
    this.settings = settings;
    this.options = settings.options;
    this.setup();
  }

  setup() {
    this.rootNode = this.settings.rootNode;
    this.setupOptions();
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

const $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  options: {
    animationModule() {}
  }
});
```

在上面的代码中, 只有一个`rootNode`是必填的参数, `options`则根据使用者的需求决定是否有必要填写.

### 保持接口的可扩展性
 





class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'ajaxAdapter';
  }

  request(url) {
    // request and return promise
  }
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'nodeAdapter';
  }

  request(url) {
    // request and return promise
  }
}

class HttpRequester {
  constructor(adapter) {
    this.adapter = adapter;
  }

  fetch(url) {
    return this.adapter.request(url).then((response) => {
      // transform response and return
    });
  }
}
## 数组

### 判断数组是否为空

```javascript
if (collection.length > 0) {
  // ...
}
```

## 模块
import { es6 } from './AirbnbStyleGuide';
export default es6;

In modules with a single export
// bad
export function foo() {}

// good
export default function foo() {}

## 函数

### 函数式

函数式的好处不是本篇讨论的重点, 假设我们有以下的对象数组, 我们想统计每个对象中的`linesOfCode`之和.
我们不需要使用`for`循环去累加, 我们应该使用更加优雅,稳定的方法:

```javascript
const programmerOutput = [
  {
    name: 'Uncle Bobby',
    linesOfCode: 500
  }, {
    name: 'Suzie Q',
    linesOfCode: 1500
  }, {
    name: 'Jimmy Gosling',
    linesOfCode: 150
  }, {
    name: 'Gracie Hopper',
    linesOfCode: 1000
  }
];

const totalOutput = programmerOutput
  .map(output => output.linesOfCode)
  .reduce((totalLines, lines) => totalLines + lines);
```

在遇到需要遍历对象或者数组的时候, 我们应该使用 higher-order function代替 `for in`或者 `for of`语句. higer-order包括
`map()`, `every()`,  `filter()`, `find()`,  `reduce()`, `some()`, `Object.keys()`, `Object.values()`, `Object.entries()`等.

### 使用setter & getter

一个function中的变量对于block外部的作用域是无法访问的(private), 因此我们需要给她提供 setter & getter 方法来访问并修改private变量

```javascript
function makeBankAccount() {
  // this one is private
  let balance = 0;

  function getBalance() {
    return balance;
  }

  function setBalance(amount) {
    balance = amount;
  }

  return {
    // ...
    getBalance,
    setBalance,
  };
}

const account = makeBankAccount();
account.setBalance(100);
```

copy array 别用for循环 用 array spreads
// good
const itemsCopy = [...items];

转数组
如果是可遍历对象
iterable object to an array, ... instead of Array.from

如果是arry-like对象 
Array.from()
别用旧方法
[].slice.call(arguments)

Never use arguments, opt to use rest syntax ... instead.
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}

function handleThings(opts = {}) {
  // ...
}
opts = opts || {};


function f1(obj) {
  obj.key = 1;
}

// good
function f2(obj) {
  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
}
// bad
const baz = [...foo].map(bar);

// good
const baz = Array.from(foo, bar);

Destructuring


array destructuring
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;







## 其他

### 注释

JS中, 写注释的时候要注意以下3点:

#### 不写无用的注释

像下面这样的注释应该杜绝在代码中出现, git是查看change log最好的地方.

```javascript
/**
 * Change log: 
 *  2018-11-01: add xxx feature
 *  2018-11-10: fix xxx bug
 */

let webRTC = RTCPeerConnection;

// create a peerConnection
let peerConnection = new webRTC();
```

#### 添加有意义的标记

```javascript
// FIXME
// TODO
```

### 缩进

使用 2 spaces 进行缩进

### Production版本中不出现console.log

除了`console.log`不出现外, 很多人会有习惯将注释的代码留着, 这也是一个非常不好的习惯, 会影响他人阅读.

```javascript

console.log('dc open');

// function foo() {
//   const self = this;
//   return function () {
//     console.log(self);
//   };
// }
```

### number 互转 string

```javascript
const totalScore = String(this.reviewScore);

const val = parseInt(inputValue, 10);
```

### 转boolean

```javascript
const age = 0
const hasAge = !!age
```

### `**` instead of pow

```javascript
const binary = Math.pow(2, 10);

const binary = 2 ** 10;
```

Don’t save references to this. Use arrow functions or Function#bind.
function foo() {
  const self = this;
  return function () {
    console.log(self);
  };
}

function foo() {
  return () => {
    console.log(this);
  };
}

函数2个以内参数

function createMenu({ title, body, buttonText, cancellable }) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
});


function emailActiveClients(clients) {
  clients
    .filter(isActiveClient)
    .forEach(email);
}

function isActiveClient(client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}

modifying some global variable
Avoid Side Effects (part 1)
function splitIntoFirstAndLastName(name) {
  return name.split(' ');
}

const name = 'Ryan McDermott';
const newName = splitIntoFirstAndLastName(name);

console.log(name); // 'Ryan McDermott';
console.log(newName); // ['Ryan', 'McDermott'];
用心址

Array.prototype.diff = function diff(comparisonArray) {
  const hash = new Set(comparisonArray);
  return this.filter(elem => !hash.has(elem));
};
class SuperArray extends Array {
  diff(comparisonArray) {
    const hash = new Set(comparisonArray);
    return this.filter(elem => !hash.has(elem));
  }
}

Avoid side effect
primitives are passed by value and objects/arrays are passed by reference
const addItemToCart = (cart, item) => {
  cart.push({ item, date: Date.now() });
};

const addItemToCart = (cart, item) => {
  return [...cart, { item, date: Date.now() }];
};


