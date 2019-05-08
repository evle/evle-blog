---
title: 'web api 1'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/web-api-1'
category: 'Web'
tags:
  - Web
description: ''
---

js 获取可视页面
网页可见区域宽： document.body.clientWidth;
网页可见区域高： document.body.clientHeight;
网页可见区域高： document.body.offsetWidth; //包括边线的宽
网页可见区域高： document.body.offsetHeight; //包括边线的宽
网页正文全文宽： document.body.scrollWidth;
网页正文全文高： document.body.scrollHeight;
网页被卷去的高： document.body.scrollTop;
网页被卷去的左： document.body.scrollLeft;
网页正文部分上： window.screenTop;
网页正文部分左： window.screenLeft;
屏幕分辨率的高： window.screen.height;
屏幕分辨率的宽： window.screen.width;
屏幕可用工作区高度： window.screen.availHeight;
屏幕可用工作区宽度： window.screen.availWidth;

https://muan.co/
JSON.stringify
我们平时经常会用到 JSON 对象，比如当我们要实现对象的深拷贝时，我们可以用 JSON 对象的 JSON.stringify 和 JSON.parse 来拷贝一个完全一样的对象，而不会对原对象产生任何引用关系。在使用 localStorage 时，也会用到它，因为 localStorage 只能存储字符串格式的内容，所以，我们在存之前，将数值转换成 JSON 字符串，取出来用的时候，再转成对象或数组。

对于 JSON.stringify 方法，它可以帮我们把一个对象或数组转换成一个 JSON 字符串。我们通常只会用到它的第一个参数，其实它还有另外两个参数，可以让它实现一些非常好用的功能。

首先来看语法：

JSON.stringify(value[, replacer [, space]])
参数：

value：将要被序列化的变量的值
replacer：替代器。可以是函数或者是数组，如果是一个函数，则 value 每个属性都要经过这个函数的处理，该函数的返回值就是最后被序列化后的值。如果是一个数组，则要求该数组的元素是字符串，且这些元素会被当做 value 的键（key）进行匹配，最后序列化的结果，是只包含该数组每个元素为 key 的值。
space：指定输出数值的代码缩进，美化格式之用，可以是数字或者字符串。如果是数字（最大为 10）的话，代表每行代码的缩进是多少个空格。如果是字符串的话，该字符串（最多前十个字符）将作显示在每行代码之前。
这时候，你应该知道了。我们可以用 JSON.stringify 来做序列化时的过滤，相当于我们可以自定义 JSON.stringify 的解析逻辑。

使用函数过滤并序列化对象：

// 使用“函数”当替代器
function replacer(key, value) {
if (typeof value === "string") {
return undefined;
}
return value;
}

var foo = {
foundation: "Mozilla",
model: "box",
week: 45,
transport: "car",
month: 7
};
var jsonString = JSON.stringify(foo, replacer);

// {"week":45,"month":7}
使用数组过滤并序列化对象：

// 使用“数组”当替代器
const user = {
name: 'zollero',
nick: 'z',
skills: ['JavaScript', 'CSS', 'HTML5']
};
JSON.stringify(user, ['name', 'skills'], 2);

// "{
// "name": "zollero",
// "skills": [
// "JavaScript",
// "CSS",
// "HTML5"
// ]
// }"
还有一个有意思的东西，是对象的 toJSON 属性。

如果一个对象有 toJSON 属性，当它被序列化的时候，不会对该对象进行序列化，而是将它的 toJSON 方法的返回值进行序列化。

见下面的例子：

var obj = {
foo: 'foo',
toJSON: function () {
return 'bar';
}
};
JSON.stringify(obj); // '"bar"'
JSON.stringify({x: obj}); // '{"x":"bar"}'
用 Set 来实现数组去重
在 ES6 中，引入了一个新的数据结构类型：Set。而 Set 与 Array 的结构是很类似的，且 Set 和 Array 可以相互进行转换。

数组去重，也算是一个比较常见的前端面试题了，方法有很多种，这里不多赘述。下面我们看看用 Set 和 ...（拓展运算符）可以很简单的进行数组去重。

const removeDuplicateItems = arr => [...new Set(arr)];
removeDuplicateItems([42, 'foo', 42, 'foo', true, true]);
//=> [42, "foo", true]
用块级作用域避免命名冲突
在开发的过程中，通常会遇到命名冲突的问题，就是需要根据场景不同来定义不同的值来赋值给同一个变量。下面介绍一个使用 ES6 中的 块级作用域 来解决这个问题的方法。

比如，在使用 switch case 时，我们可以这样做：

switch (record.type) {
case 'added': {
const li = document.createElement('li');
li.textContent = record.name;
li.id = record.id;
fragment.appendChild(li);
break;
}

case 'modified': {
const li = document.getElementById(record.id);
li.textContent = record.name;
break;
}
}
函数参数值校验
我们知道，在 ES6 中，为函数增加了参数默认值的特性，可以为参数设定一些默认值，可以让代码更简洁，可维护。

其实，我们可以通过这个特性来做函数参数值的校验。

首先，函数的参数可以是任意类型的值，也可以是函数，比如下面这个：

function fix(a = getA()) {
console.log('a', a)
}

function getA() {
console.log('get a')
return 2
}

fix(1);
// a 1

fix();
// get a
// a 2
可以看出，如果在调用 fix 时传了参数 a ，则不会执行函数 getA，只有当不传递参数 a 时，才会执行函数 getA。

这时候，我们可以利用这一特性，为参数 a 添加一个必传的校验，代码如下：

function fix(a = require()) {
console.log('a', a)
}

function require() {
throw new Error('缺少了参数 a')
}

fix(1);
// a 1

fix();
// Uncaught Error: 缺少了参数 a
用解构赋值过滤对象属性
在前面我们介绍了使用 JSON.stringify 来过滤对象的属性的方法。这里，我们介绍另外一种使用 ES6 中的 解构赋值 和 拓展运算符 的特性来过滤属性的方法。

比如，下面这段示例：

// 我们想过滤掉对象 types 中的 inner 和 outer 属性
const { inner, outer, ...restProps } = {
inner: 'This is inner',
outer: 'This is outer',
v1: '1',
v2: '2',
v4: '3'
};
console.log(restProps);
// {v1: "1", v2: "2", v4: "3"}
用解构赋值获取嵌套对象的属性
解构赋值 的特性很强大，它可以帮我们从一堆嵌套很深的对象属性中，很方便地拿到我们想要的那一个。比如下面这段代码：

// 通过解构赋值获取嵌套对象的值
const car = {
model: 'bmw 2018',
engine: {
v6: true,
turbo: true,
vin: 12345
}
};
// 这里使用 ES6 中的简单写法，使用 { vin } 替代 { vin: vin }
const modalAndVIN = ({ model, engine: { vin }}) => {
console.log(`model: ${model}, vin: ${vin}`);
}

modalAndVIN(car);
// "model: bmw 2018, vin: 12345"
合并对象

ES6 中新增的 拓展运算符，可以用来解构数组，也可以用来解构对象，它可以将对象中的所有属性展开。

通过这个特性，我们可以做一些对象合并的操作，如下：

// 使用拓展运算符合并对象，在后面的属性会重写前面相同属性的值
const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { c: 5, d: 9 };
const merged = { ...obj1, ...obj2 };
console.log(merged);
// {a: 1, b: 2, c: 5, d: 9}

const obj3 = { a: 1, b: 2 };
const obj4 = { c: 3, d: { e: 4, ...obj3 } };
console.log(obj4);
// {c: 3, d: {a: 1, b: 2, e: 4} }
使用 === 代替 ==

在 JavaScript 中，=== 和 == 是有很大的不同的，== 会将两边的变量进行转义，然后将转义后的值进行比较，而 === 是严格比较，要求两边的变量不仅值要相同，它们自身的类型也要相同。

JavaScript 经常被调侃成一个神奇的语言，就是因为它的转义的特性，而用 == 可能会引入一些深埋的 bug。远离 bug，还是要用 ===：

[10] == 10 // true
[10] === 10 // false

'10' == 10 // true
'10' === 10 // false

[] == 0 // true
[] === 0 // false

'' == false // true
'' === false // false
当然，在用 === 时，也会出问题，比如：

NaN === NaN // false
ES6 中提供了一个新的方法：Object.is()，它具有 === 的一些特点，而且更好、更准确，在一些特殊场景下变现的更好：

Object.is(0 , ' '); //false
Object.is(null, undefined); //false
Object.is([1], true); //false
Object.is(NaN, NaN); //true

String Skill

时间对比：时间个位数形式需补 0

const time1 = "2019-03-31 10:00:00";
const time2 = "2019-05-01 09:00:00";
const overtime = time1 > time2;
// overtime => false
复制代码
格式化金钱：带小数无效

const thousand = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const money = thousand(123456789);
// money => "123,456,789"
复制代码
生成随机 ID

const randomId = len => Math.random().toString(36).substr(3, len);
const id = randomId(10);
// id => "jg7zpgiqva"
复制代码
生成随机 HEX 色值

const randomColor = () => "#" + Math.floor(Math.random() \* 0xffffff).toString(16).padEnd(6, "0");
const color = randomColor();
// color => "#2e90e3"
复制代码
生成星级评分

const startScore = rate => "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
const start = startScore(3);
// start => "★★★"
复制代码
操作 URL 查询参数

const params = new URLSearchParams(location.search); // location.search = "?name=young&sex=male"
params.has("young"); // true
params.get("sex"); // "male"
复制代码 Number Skill

取整：代替正数的 Math.floor()，代替负数的 Math.ceil()

const num1 = ~~ 1.33;
const num2 = 1.33 | 0;
const num3 = 1.33 >> 0;
// num1 num2 num3 => 1 1 1
复制代码
补零

const fillZero = (num, len) => num.toString().padStart(len, "0");
const num = fillZero(123, 5);
// num => "00123"
复制代码
转数值：只对 null、""、false、数值字符串有效

const num1 = +null;
const num2 = +"";
const num3 = +false;
const num4 = +"123";
// num1 num2 num3 num4 => 0 0 0 123
复制代码
精确小数

const round = (num, decimal) => Math.round(num \* 10 ** decimal) / 10 ** decimal;
const num = round(1.33, 1);
// num => 1.3
复制代码
判断奇偶

const num = 0;
const odd = !!(num & 1);
// odd => false
复制代码
取最小最大值

const arr = [0, 1, 2];
const min = Math.min.apply(Math, arr);
const max = Math.max.apply(Math, arr);
// min max => 0 2
复制代码 Boolean Skill

短路运算符

const a = d && 1; // 满足条件赋值：取假运算，从左到右依次判断，遇到假值返回假值，后面不再执行，否则返回最后一个真值
const b = d || 1; // 默认赋值：取真运算，从左到右依次判断，遇到真值返回真值，后面不再执行，否则返回最后一个假值
const c = !d; // 取假赋值：单个表达式转换为 true 则返回 false，否则返回 true
复制代码
是否为空数组

const arr = [];
const flag = Array.isArray(arr) && !arr.length;
// flag => true
复制代码
是否为空对象

const obj = {};
const flag = Object.prototype.toString.call(obj) && !Object.keys(obj).length;
// flag => true
复制代码
满足条件时执行

const flagA = true; // 条件 A
const flagB = false; // 条件 B
(flagA || flagB) && Func(); // 满足 A 或 B 时执行
(flagA || !flagB) && Func(); // 满足 A 或不满足 B 时执行
flagA && flagB && Func(); // 同时满足 A 和 B 时执行
flagA && !flagB && Func(); // 满足 A 且不满足 B 时执行
复制代码
为非假值时执行

const flag = false; // undefined、null、""、0、false、NaN
!flag && Func();
复制代码
数组不为空时执行

const arr = [0, 1, 2];
arr.length && Func();
复制代码
对象不为空时执行

const obj = { a: 0, b: 1, c: 2 };
Object.keys(obj).length && Func();
复制代码
函数退出代替条件分支退出

if (flag) {
Func();
return false;
}
// 换成
if (flag) {
return Func();
}
复制代码 Array Skill

克隆数组

const \_arr = [0, 1, 2];
const arr = [..._arr];
// arr => [0, 1, 2]
复制代码
合并数组

const arr1 = [0, 1, 2];
const arr2 = [3, 4, 5];
const arr = [...arr1, ...arr2];
// arr => [0, 1, 2, 3, 4, 5];
复制代码
去重数组

const arr = [...new Set([0, 1, 1, null, null])];
// arr => [0, 1, null]
复制代码
混淆数组

const arr = [0, 1, 2, 3, 4, 5].slice().sort(() => Math.random() - .5);
// arr => [3, 4, 0, 5, 1, 2]
复制代码
交换赋值

let a = 0;
let b = 1;
[a, b] = [b, a];
// a b => 1 0
复制代码
过滤空值：undefined、null、""、0、false、NaN

const arr = [undefined, null, "", 0, false, NaN, 0, 1, 2].filter(Boolean);
// arr => [0, 1, 2]
复制代码
异步累计

async function Func(deps) {
return deps.reduce(async(t, v) => {
const dep = await t;
const version = await Todo(v);
dep[v] = version;
return dep;
}, Promise.resolve({}));
}
const result = await Func(); // 需在 async 包围下使用
复制代码
首部插入元素

let arr = [1, 2]; // 以下方法任选一种
arr.unshift(0);
arr = [0].concat(arr);
arr = [0, ...arr];
// arr => [0, 1, 2]
复制代码
尾部插入元素

let arr = [0, 1]; // 以下方法任选一种
arr.push(2);
arr.concat(2);
arr[arr.length] = 2;
arr = [...arr, 2];
// arr => [0, 1, 2]
复制代码
统计元素个数

const arr = [0, 1, 1, 2, 2, 2];
const count = arr.reduce((t, c) => {
t[c] = t[c] ? ++ t[c] : 1;
return t;
}, {});
// count => { 0: 1, 1: 2, 2: 3 }
复制代码
创建指定长度数组

const arr = [...new Array(3).keys()];
// arr => [0, 1, 2]
复制代码
创建指定长度且值相等的数组

const arr = [...new Array(3).keys()].fill(0);
// arr => [0, 0, 0]
复制代码
reduce 代替 map 和 filter

const \_arr = [0, 1, 2];

// map
const arr = \_arr.map(v => v _ 2);
const arr = \_arr.reduce((t, c) => {
t.push(c _ 2);
return t;
}, []);
// arr => [0, 2, 4]

// filter
const arr = \_arr.filter(v => v > 0);
const arr = \_arr.reduce((t, c) => {
c > 0 && t.push(c);
return t;
}, []);
// arr => [1, 2]

// map 和 filter
const arr = \_arr.map(v => v _ 2).filter(v => v > 2);
const arr = \_arr.reduce((t, c) => {
c = c _ 2;
c > 2 && t.push(c);
return t;
}, []);
// arr => [4]
复制代码 Object Skill

克隆对象

const \_obj = { a: 0, b: 1, c: 2 }; // 以下方法任选一种
const obj = { ...\_obj };
const obj = JSON.parse(JSON.stringify(\_obj));
// obj => { a: 0, b: 1, c: 2 }
复制代码
合并对象

const obj1 = { a: 0, b: 1, c: 2 };
const obj2 = { c: 3, d: 4, e: 5 };
const obj = { ...obj1, ...obj2 };
// obj => { a: 0, b: 1, c: 3, d: 4, e: 5 }
复制代码
对象字面量：获取环境变量时必用此方法，用它一直爽，一直用它一直爽

const env = "prod";
const link = {
dev: "Development Address",
test: "Testing Address",
prod: "Production Address"
}[env];
// env => "Production Address"
复制代码
创建纯空对象

const obj = Object.create(null);
Object.prototype.a = 0;
// obj => {}
复制代码
解构嵌套属性

const obj = { a: 0, b: 1, c: { d: 2, e: 3 } };
const { c: { d, e } } = obj;
// d e => 2 3
复制代码
解构对象别名

const obj = { a: 0, b: 1, c: 2 };
const { a, b: d, c: e } = obj;
// a d e => 0 1 2
复制代码
删除无用属性

const obj = { a: 0, b: 1, c: 2 }; // 只想拿 b 和 c
const { a, ...rest } = obj;
// rest => { b: 1, c: 2 }
复制代码 Function Skill

函数自执行

const Func = function() {}(); // 常用

(function() {})(); // 常用
(function() {}()); // 常用
[function() {}()];

- function() {}();

* function() {}();
  ~ function() {}();
  ! function() {}();

new function() {};
new function() {}();
void function() {}();
typeof function() {}();
delete function() {}();

1, function() {}();
1 ^ function() {}();
1 > function() {}();
复制代码
隐式返回值：只能用于单语句返回值箭头函数，如果返回值是对象必须使用()包住

const Func = function(name) {
return "I Love " + name;
};
// 换成
const Func = name => "I Love " + name;
复制代码
一次性函数：适用于运行一些只需执行一次的初始化代码

function Func() {
console.log("x");
Func = function() {
console.log("y");
}
}
复制代码
惰性载入函数：函数内判断分支较多较复杂时可大大节约资源开销

function Func() {
if (a !== b) {
console.log("x");
} else {
console.log("y");
}
}
// 换成
function Func() {
if (a !== b) {
Func = function() {
console.log("x");
}
} else {
Func = function() {
console.log("y");
}
}
return Func();
}
复制代码
检测非空参数

function IsRequired() {
throw new Error("param is required");
}
function Func(name = IsRequired()) {
console.log("I Love " + name);
}
Func(); // "param is required"
Func("雅君妹纸"); // "I Love 雅君妹纸"
复制代码
字符串创建函数

const Func = new Function("name", "console.log(\"I Love \" + name)");
复制代码
优雅处理错误信息

try {
Func();
} catch (e) {
location.href = "https://stackoverflow.com/search?q=[js]+" + e.message;
}
复制代码
优雅处理 Async/Await 参数

function AsyncTo(promise) {
return promise.then(data => [null, data]).catch(err => [err]);
}
const [err, res] = await AsyncTo(Func());
复制代码
优雅处理多个函数返回值

async function getAll() {
return await Promise.all([
fetch("/user"),
fetch("/comment")
]);
}
const [user, comment] = getAll();
复制代码 DOM Skill

显示全部 DOM 边框：调试页面元素边界时使用

[].forEach.call(\$\$("_"), dom => {
dom.style.outline = "1px solid #" + (~~(Math.random() _ (1 << 24))).toString(16);
});
复制代码
自适应页面：页面基于一张设计图但需做多款机型自适应，元素尺寸使用 rem 进行设置

function AutoResponse(width = 750) {
const target = document.documentElement;
target.clientWidth >= 600
? (target.style.fontSize = "80px")
: (target.style.fontSize = target.clientWidth / width \* 100 + "px");
}
复制代码

作者：JowayYoung
链接：https://juejin.im/post/5cc7afdde51d456e671c7e48
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

1.创建 canvas 对象
var myCanvas = document.getElementById("gcanvas"); 2.利用 canvas 对象获取 webgl
var gl = myCanvas.getContext('experimental-webgl'); 3.利用 webgl 获取显卡信息
var graphicInfo = gl.getExtension("WEBGL_debug_renderer_info");
