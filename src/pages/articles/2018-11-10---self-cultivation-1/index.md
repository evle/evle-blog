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


访问`Primitives`类型的变量时是直接操作她的值, 访问`Complex`变量操作的是她的引用, 举个例子
string
number
boolean
null
undefined
symbol

object
array
function

const let block-scoped.

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};

Do not call Object.prototype methods directly, such as hasOwnProperty, propertyIsEnumerable, and isPrototypeOf
consider { hasOwnProperty: false } - or, the object may be a null object (Object.create(null)).
console.log(Object.prototype.hasOwnProperty.call(object, key));

// best
const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
/* or */
// ...
console.log(has.call(object, key));

shallow-copy

const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 });

const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

const { a, ...noA } = copy; // noA => { b: 2, c: 3 }

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

当访问对象的多个属性时，时候Destructing

比如当访问
var user = {
	name: 'evle',
	age: 12
}

let name = user.name
let age = user.age
换成
let {name, age} = user;

又比如
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}
进一步
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

array destructuring
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;

我们都知道在JS中, 我们可以通过返回数组或者对象达到 函数可以返回多个返回值的目的
但是使用数组返回时候 我们需要考虑数据的位置
因此 在返回值的时候 我们统一使用 object destructuring返回多个值
function processInput(input) {
  // then a miracle occurs
  return { left, right, top, bottom };
}

// the caller selects only the data they need
const { left, top } = processInput(input);

用class 代替 prototype
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
实现链式调用
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

$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount();

const luke = new Jedi();

luke.jump()
  .setHeight(20);


module
import { es6 } from './AirbnbStyleGuide';
export default es6;

In modules with a single export
// bad
export function foo() {}

// good
export default function foo() {}


用higher-order function代替  for in  for of
Use map() / every() / filter() / find() / findIndex() / reduce() / some() / ... to iterate over arrays, and Object.keys() / Object.values() / Object.entries() to produce arrays so you can iterate over objects.


// bad
const binary = Math.pow(2, 10);

// good
const binary = 2 ** 10;

Disallow unused variables

Objects evaluate to true
Undefined evaluates to false
Null evaluates to false
Booleans evaluate to the value of the boolean
Numbers evaluate to false if +0, -0, or NaN, otherwise true
Strings evaluate to false if an empty string '', otherwise true
if ([0] && []) {
  // true
  // an array (even an empty one) is an object, objects will evaluate to true
}

if (collection.length > 0) {
  // ...
}


Comments
// FIXME
// TODO

 2 spaces

转stinrg
const totalScore = String(this.reviewScore);

const val = Number(inputValue);

// good
const val = parseInt(inputValue, 10);

转boolean 
const age = 0
const hasAge = !!age


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

one thing
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


functional programming

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

let totalOutput = 0;

for (let i = 0; i < programmerOutput.length; i++) {
  totalOutput += programmerOutput[i].linesOfCode;
}

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

Encapsulate conditionals
Bad:

if (fsm.state === 'fetching' && isEmpty(listNode)) {
  // ...
}
Good:

function shouldShowSpinner(fsm, listNode) {
  return fsm.state === 'fetching' && isEmpty(listNode);
}

if (shouldShowSpinner(fsmInstance, listNodeInstance)) {
  // ...
}


Avoid conditionals
class Airplane {
  // ...
  getCruisingAltitude() {
    switch (this.type) {
      case '777':
        return this.getMaxAltitude() - this.getPassengerCount();
      case 'Air Force One':
        return this.getMaxAltitude();
      case 'Cessna':
        return this.getMaxAltitude() - this.getFuelExpenditure();
    }
  }
}
class Airplane {
  // ...
}

class Boeing777 extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getPassengerCount();
  }
}

class AirForceOne extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude();
  }
}

class Cessna extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getFuelExpenditure();
  }
}

Objects and Data Structures
function makeBankAccount() {
  // ...

  return {
    balance: 0,
    // ...
  };
}

const account = makeBankAccount();
account.balance = 100;


Good:

function makeBankAccount() {
  // this one is private
  let balance = 0;

  // a "getter", made public via the returned object below
  function getBalance() {
    return balance;
  }

  // a "setter", made public via the returned object below
  function setBalance(amount) {
    // ... validate before updating the balance
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





SOLID

Single Responsibility Principle (SRP)

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
Good:

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

Open/Closed Principle (OCP)

Interface Segregation Principle (ISP)
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

class AjaxAdapter extends Adapter {
  constructor() {
    super();
    this.name = 'ajaxAdapter';
  }

  request(url) {
    // request and return promise
  }
}

接口易于扩展
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
