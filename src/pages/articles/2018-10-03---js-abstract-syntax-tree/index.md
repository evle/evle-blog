---
title: "Abstract syntax trees on Javascript"
date: "2018-10-03"
layout: post
draft: true
path: "/posts/js-abstract-syntax-tree"
category: ""
tags:
  - 
description: ""
---

1.babylon解释器把代码字符串转化为AST树, 例如import {uniq, extend, flatten, cloneDeep } from "lodash"转化为AST树

2.babel-traverse对AST树进行解析遍历出整个树的path.
3.plugin转换出新的AST树.
4.输出新的代码字符串 


首先我们需要安装二个工具babel-core和babel-types;
npm install --save babel-core babel-types;

babel-core提供transform方法将代码字符串转换为AST树
babel-types提供各种操作AST节点的工具库

var babel = require('babel-core');
var t = require('babel-types');
const code = `import {uniq, extend, flatten, cloneDeep } from "lodash"`;
const visitor = {
    Identifier(path){
        console.log(path.node.name)
    }
}
const result = babel.transform(code, {
    plugins: [{
        visitor: visitor
    }]
})
https://astexplorer.net/



Identifier:{
    enter(path) {
        console.log("我是进入的：",path.node.name)
    },
    exit(path) {
        console.log("我是进入的：",path.node.name)
    }
}


作者：fiveoneLei
链接：https://juejin.im/post/5a17d51851882531b15b2dfc
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

path
path 表示两个节点之间的连接，通过这个对象我们可以访问到当前节点、子节点、父节点和对节点的增、删、修改、替换等等一些操作。下面演示将uniq替换_uniq 代码如下：


var babel = require('babel-core');
var t = require('babel-types');
const code = `import {uniq, extend, flatten, cloneDeep } from "lodash"`;

const visitor = {
    Identifier(path){
        if (path.node.name == "uniq") {
            var newIdentifier = t.identifier('_uniq')  //创建一个名叫_uniq的新identifier节点
            path.replaceWith(newIdentifier)            //把当前节点替换成新节点
        }
    }
}

const result = babel.transform(code, {
    plugins: [{
        visitor: visitor
    }]
})
console.log(result.code) //import { _uniq, extend, flatten, cloneDeep } from "lodash";


获取参数
{
  "plugins": [ ["./plugin", {
    "bad": "good",
    "dead": "alive"
  }] ]
}
module.exports = function({ types: babelTypes }) {
  return {
    name: "deadly-simple-plugin-example",
    visitor: {
      Identifier(path, state) {
        let name = path.node.name;
        if (state.opts[name]) {
          path.node.name = state.opts[name];
        }
      }
    }
  };
};


if ( process.env.NODE_ENV === 'development' ) {
  console.log('我是程序猿小卡');
}// plugin.js
module.exports = function({ types: babelTypes }) {
  return {
    name: "node-env-replacer",
    visitor: {
	  // 成员表达式
      MemberExpression(path, state) {
	    // 如果 object 对应的节点匹配了模式 "process.env"
        if (path.get("object").matchesPattern("process.env")) {
		  // 这里返回结果为字符串字面量类型的节点
          const key = path.toComputedKey();
          if ( babelTypes.isStringLiteral(key) ) {
		    // path.replaceWith( newNode ) 用来替换当前节点
			// babelTypes.valueToNode( value ) 用来创建节点，如果value是字符串，则返回字符串字面量类型的节点
            path.replaceWith(babelTypes.valueToNode(process.env[key.value]));
          }
        }
      }
    }
  };
};

https://babeljs.io/docs/en/babel-types
https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#builders

https://github.com/GoogleChrome/puppeteer/blob/v1.8.0/docs/api.md#targetpage





1. babel 理论
2. babel 应用
   