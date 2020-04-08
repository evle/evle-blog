---
title: "从0到1实现一个webpack打包工具"
date: "2020-03-26"
layout: post
draft: false
path: "/posts/webpack-source"
category: "Webpack"
tags:
  - 
description: ""
---

## 从模块化规范说起

在实现webpack之前我们先回顾一下js模块化的规范

### commonjs

commonjs的模块实现原理是: 读取目标模块内容并运行, 参数传入一个module对象, 模块运行结果会挂到module.exports属性上面. require是保存在缓存中的，即require一次之后再次require值是不会改变, 有可能会被修改, 但可以通过`delete require.cache[modulePath]`让该模块重新加载而不是读缓存.

```javascript
function require(module){
  let content = fs.readFileSync(module, 'utf-8')
  
  // 使用new Function将模块内容变为一个函数
  let fn = new Function('exports', 'module', 'require', '__dirname', '__filename', 
   content + '\n return module.exports')
  )
  let module = {
    exports:{}
  }
  // 传入module, 当函数执行完会将module.exports返回
  return fn(module.exports, module, require, __dirname, __diranme);
}
```

对比import:

- import是编译加载 所以在文件头部, require是动态加载所以可以放到任何地方, react的动态加载使用require,或者`import()`, 它与import不是一个东西 
- commonjs输出的，是一个值的拷贝，而es6输出的是值的引用

### amd

commonjs模块规范只能以同步方式加载模块, 因此在浏览器端使用起来可能会导致加载模块时候阻塞UI, 因此有了amd规范以及代表实现require.js.

require.js的实现主要是`defined`和`require`, defined用来定义一个模块以及它所需要的依赖. require则用来加载模块依赖.

```javascript
let factories = {}

function define(moduleName, dependencies, factory){
  factory.dependencies = dependencies;
  factories[moduleName] = factory
}

function require(mods, cb){
  // 加载依赖模块
  let result = mods.map(mod=>{
    let factory = factories[mod];
    let exports;
    // 如果依赖模块又有依赖 则递归拿到结果
    let dependencies = factory.dependencies;
    require(dependencies, function(){
      exports = factory.apply(null, arguments)
    })
    return exports;
  })
  cb(result)
}
```

我们可以看到如果使用amd加载模块, 那么要额外学习amd的语法, 而且注定是一个临时的解决方案, 幸运的是webpack诞生了, 可以让我们使用commonjs的模块规范或者js自己的模块规范来构建应用程序.

## 编写自己的webpack

下面通过分析webpack打包的bunble来模拟一次webpack构建:

1. 读取入口文件
2. 替换webpack bundle中的变量

```javascript
let entry = './src/index.js' 
let output = './dist/main.js'
let fs = require('fs')
let script = fs.readFileSync(entry, 'utf-8')

let template = `


```


### 支持loader

webpack中, loader的作用是转化代码, 比如将es6代码转换成es5代码. webpack提供了