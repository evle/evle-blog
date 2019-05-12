---
title: "那些年反复学习的JS正则表达式"
date: "2019-05-09"
layout: post
draft: false
path: "/posts/regexp-application"
category: "JavaScript"
tags:
  - JavaScript
description: ""
---

> Some people, when confronted with a problem, think ‘I know, I’ll use regular expressions.’ Now they have two problems.      Jamie Zawinski

之前学正则表达式的过程就是一个反复学, 反复忘的过程, 感觉某个点需要正则表达式来解决, 但实际编写正则表达式的时候又去查一遍, 又去重新思考一遍, 本文对正则表达式进行一个回顾, 加深对正则表达式理解以及记忆。

## 什么是正则表达式

正则表达式是用来匹配字符串的一种工具, 当我们需要匹配指定字符时, 就可能用的到正则表达式。还记得小时候在windows上搜索文件时会输入`*.exe`找电脑上的游戏, 不知不觉的使用了`*`这个正则表达式, 用来匹配任意字符。

试想我们需要提取下面一段编号, 实现`String.prototype.split('-')`的效果

```bash
0101-1232-2123
```

我们需要3个点

- 先匹配出模型, 也就是连续4个数字, 使用-分隔。

```javascript
/\d{4}\-\d{4}\-\d{4}/.test('0101-1232-2123')
```

- 提取出3组数字

```javascript
/(\d{4})\-(\d{4})\-(\d{4})/.exec('0101-1232-2123')
```

- 将结果转化为一个数组

```javascript
const result = Array.from(/(\d{4})\-(\d{4})\-(\d{4})/.exec('0101-1232-2123')).slice(1);
// [0101, 1232, 2123]
```

有了上面的基础让我们来提取一个时间, 比如现在时间是`8:17:23`

先分析格式: 在表述时间数字时如果是6点, 我们可以表述为06或者6, 也有可能由1开头,比如10点,也有可能由2开头比如21点。我们需要使用或 `|` 来列出所有可能的时间, 于是我们匹配出上面8的模式为

```javascript
/[0-9]|0[0-9]|1[0-9]|2[0-3]/
```

匹配出模式后, 我们使用`()`将匹配到的字符提取出来并且用`^`和`$`做头尾限定

```javascript
const reg = /^(0[0-9]|1[0-9]|2[0-3]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])\:(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])$/;
```

最后将它转换成数组

```javascript
Array.from(reg.exec('11:17:23')).slice(1)

// [8, 17, 23]
```

这样提取出来使用并不是很方便, ES2018支持命名提取的功能, 比如我们可以直接使用`result.group.second`获取`23`。命名提取语法是在提取的分组前加上`?<name>`

```javascript
const reg = /^(?<h>0[0-9]|1[0-9]|2[0-3]|[0-9])\:(?<m>0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])\:(?<s>0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|[0-9])$/;

const result = reg.exec('8:17:23') 

result.groups // {h: "11", m: "17", s: "23"}
```

命名与提取的内容组合成了对象, 我们可以直接通过 `result.groups.h`的方式去访问提取内容。

"提取" 操作, 除了使用`exec`之外, 还可以使用`match`方法, 比如我们提取下面字符串中的`{{var}}`变量

```javascript
var str = `name: {{name}}, age: {{age}}, sex: {{sex}}`

str.match(/\{\{\w+\}\}/g) // output:  ["{{name}}", "{{age}}", "{{sex}}"]
```


## 模版引擎

模版引擎在在Web框架中占有举足轻重的地位, 各种模版引擎层出不穷pug, handlebars, ejs, 模版引擎就是让字符串可以进行一些逻辑表达, 实现这个功能的核心就是正则表达式, 让我们看一个最简单的例子: 替换字符串中的变量, 我们现在有字符串`I am {name}, and {age} years old`, 我们想替换字符串中的`{name}`和`{age}`怎么办?

```javascript
function tpl2string(tpl, data){
  let reg = /(\{\w+\})/g
  return str = str.replace(reg, function(){
    return data[arguments[1].slice(1, -1)]
  })
}

tpl2string('I am {name} and {age} years old', {
  name: 'max',
  age: '15'
})

// output: "I am max and 15 years old"
```

更多关于实现一个模版引擎的细节可以在另一篇文章 **如何实现一个模版引擎** 中阅读。

## 匹配行为

正则表达式默认是贪婪匹配, 也就是尽可能匹配多的字符, 举一个例子:

`your time is limited` 这句话有3个空格, 我们如果想匹配空格之前的字符

```javascript
/.+\s/.exec('your time is limited')[0]

// your time is
```

它默认匹配到了最后一个空格前面的字符`your time is `, 如果不想让它进行贪婪匹配, 我们只想匹配到第一个空格之前的字符`your `我们就需要使用`?`来进行非贪婪匹配

```javascript
/.+?\s/.exec('your time is limited')[0]

// your 
```

下面让我们限定一下匹配, 如果要匹配博客的顶级域名也就是提取`https://evle.netlify.com/netlify-usage`中的`netlify`。

```javascript
const s = `https://evle.netlify.com/netlify-usage`
/(\w+)\.com/.exec(s)[1]

// output: netlify
```

我们也可以使用更精准的限定: 正向否定查找, 字符串后面必须跟着`.com`, 语法是x(?=y)

```javascript
/\w+(?=\.com)/.exec(s)[0] output: netlify
```

我们同样可以匹配`3.1415926`中小数点前面的数字和后面的数字

```javascript
/\d+(?=\.)/.exec("3.1415926")[0]  // .之前
/\d+(?!\.)/.exec("3.1415926")[0]  // .之后 语法 x(?!y)
```

## 替换

用正则表达式匹配后替换成指定字符是很常见的场景, 比如

```javascript
'papa'.replace(/p/g, 'm'); // output: mama
```

再比如替换2个字符的位置, 我们可以用`$1`, `$2`这样的方式来暂存匹配到的变量然后进行交换

```javascript
"Liskov, Barbara\nMcCarthy, John\nWadler, Philip"
    .replace(/(\w+), (\w+)/g, "$2 $1"));

//output:
//   Barbara Liskov
//   John McCarthy
//   Philip Wadler
```

我们也可以使用函数来在替换时加入一些逻辑, 如前面模版引擎中那样的使用方式

```javascript
let stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
  amount = Number(amount) - 1;
  if (amount == 1) { // only one left, remove the 's'
    unit = unit.slice(0, unit.length - 1);
  } else if (amount == 0) {
    amount = "no";
  }
  return amount + " " + unit;
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne));
// → no lemon, 1 cabbage, and 100 eggs
```

此外正则表达式是可以动态创建的比如:

```javascript
let name = "harry";
let text = "Harry is a suspicious character.";
let regexp = new RegExp("\\b(" + name + ")\\b", "gi");
console.log(text.replace(regexp, "_$1_"));
// output: _Harry_ is a suspicious character.
```

## The lastIndex

正则表达式中的`lastIndex`的属性时常让人疑惑, `lastIndex`的意图是让我们能够选择匹配字符时的起点, 我们可以更改`lastIndex`来调整匹配字符的起点

```javascript
let reg = /\d+/g
reg.lastIndex = 3;
```

需要注意的是当正则表达式开启`g`或`y`模式时, lastIndex才生效, 上面表示从第三个下标开始搜索, 但是它有一个副作用

```javascript
var str="JavaScript";
var reg=/JavaScript/g;

console.log(reg.test(str));  // true
console.log(reg.test(str));  // false
```

原因是因为如果找到匹配的字符, `reg.lastIndex`的值已经变为10, 从下标10开始找当然找不到了, 所以如果想这样使用需要手动将lastIndex设置为0

```javascript
reg.test(str)
reg.lastIndex = 0
reg.test(str)
```

看这怪异的使用方式, 我们应该就意识到使用场景错了。 对, 要优雅

```javascript
var str="JavaScript";
var find = "JavaScript"

str.includes(find)
```

## 解析文件

ini是windows上的传统配置文件, 让我们用正则表达式写一个ini文件解析器来解析我们需要使用的数据

```javascript
function parseINI(string) {
  let result = {};
  let section = result;
  // 逐行解析
  string.split(/\r?\n/).forEach(line => {
    let match;
    // 匹配 key=value类型
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    // 匹配[address]类型
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;.*)?$/.test(line)) {
      throw new Error("Line '" + line + "' is not valid.");
    }
  });
  return result;
}

// 测试文件
const config = `
            name=Vasilis
            [address]
            city=Tessaloniki`

parseINI(config)

// output
// {name: "Vasilis", address: {city: "Tessaloniki"}}
```

## 总结

正则表达式无论在前端还是运维都是非常重要的存在, 虽然正则表达式的纯文本解析会有一定性能上的问题, 但针对使用的场景无疑是利器, grep, awk, sed这些强大的文本处理工具的核心都是正则表达式, 本文会持续更新一些正则表达式的技巧与实用代码片段。