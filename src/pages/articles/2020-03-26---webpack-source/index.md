---
title: "webpack是如何打包代码的?"
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

在实现webpack之前我们先回顾一下js模块化的规范, 因为webpack的编译模版代码的原理和commonjs模块的原理相同.

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

webpack的编译其实就是预先写好了模版代码, 然后用模版引擎将用户的代码组成`{moduleId: sourceCode}`这样一个对象渲染到模版中, 然后运行这个模版代码.

这个对象中的`moudleId`是模块相对于`src`一个路径, 但是我们写代码时候通常都是写的相对路径, 因此这里我们为了得到相对于`src`的根路径需要使用AST进行转换, 并且我们要将`sourceCode`中的`require`全部改为`__webpack_require__`供webpack模版代码调用.

在这里AST工具链使用babel全家桶: 

- babylon
- babel-types
- babel-generator
- babel-traverse

```javascript
buildModule(moduleId){ // 在webpack中moduleId就是模块的绝对路径
  let originalSource = fs.readFileSync(moduleId, 'utf-8');
  const ast = babylon.parse(originalSource);
  traverse(ast, {
    CallExpression:(nodePath)=>{
      if(nodePath.node.callee.name == 'require'){
        let node = nodePath.node;
        // 1. require -> __webpack_require__
        node.callee.name = '__webpack_require__';

        // 2. ./hello.js -> ./src/hello.js   posix:跨平台
        let moduleName = node.arguments[0].value;
        let dependencyModuleId = './' + path.posix.join(path.posix.dirname(moduleId), moduleName);

        // 需要把所有依赖模块存起来 递归的对所有依赖摸进行转换
        dependencies.push(dependencyModuleId);
        node.arguments = [types.stringLiteral(dependencyModuleId)];
      }
    }
  })

  let {code} = generator(ast);
  // 生成 {moduleId: sourceCode} 的结构
  this.modules[moduleId] = code;

  // 递归转换
  dependencies.forEach(dependency => this.buildModule(dependency))
}
```

通过上面的AST转换后我们接下来就可以使用ejs进行渲染了, 要渲染2个地方:

1. 模版代码中的入口文件
2. 模版代码中的依赖模块

```javascript

(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };

      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports;
    }
    // 1. 渲染入口
    return __webpack_require__(__webpack_require__.s = "<%-entryId%>");
  })
    ({  // 2. 渲染模块
        <%
          for(let id in modules){
              let {moduleId,_source} = modules[id];%>
              "<%-moduleId%>":
              (function (module, exports,__webpack_require__) {
                <%-_source%>
              }),
           <%}
        %>
    });
```

以上我们就完成了webpack的编译过程, 模版代码的实现可以直接看webpack在`development`模式下打包出来的bundle, 其实现原理其实就是commonjs的实现原理.

### 支持loader

loader的功能是对代码进行变形, 因此我们在读取到模块的源文件后首先要做的事情是使用对应的loader对代码进行变形.

```javascript
...
build(compilation){
  // 调用loader变形代码
  let originalSource = this.getSource(this.request,compilation);
  const ast = babylon.parse(originalSource);
...


 getSource(request,compilation){
        // 读取代码源文件
        let source = compilation.inputFileSystem.readFileSync(this.request,'utf8');
        let { module: { rules } } = compilation.options;
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            // 是否匹配
            if (rule.test.test(request)) {
                let loaders = rule.use;
                let loaderIndex = loaders.length - 1;
                let iterateLoaders = ()=>{
                    let loaderName = loaders[loaderIndex];
                     // 加载对应的loader对source记性处理
                    let loader = require(path.resolve(this.context, 'loaders', loaderName));
                    source = loader(source);
                    if (loaderIndex > 0) {
                        loaderIndex--;
                        iterateLoaders();
                    }
                }
                iterateLoaders();
                break;
            }
        }
        return source;
    }
```

## 总结

本篇文章介绍了js模块对规范以及`requrie`和es6模块的对比, webpack是基于commonjs的原理实现的一种打包工具, webpack的编译流程实际上就是一个渲染模版引擎的过程, 渲染之前要做的2个关键是转换模块路径为相对于`src`的路径, 以及将模块中的`require`全部转换为`__webpack_require__`.
