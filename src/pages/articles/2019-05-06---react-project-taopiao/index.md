---
title: '记一次React应用开发 淘票APP '
date: '2019-05-06'
layout: post
draft: false
path: '/posts/react-project-taopiao'
category: 'React'
tags:
  - React
description: ''
---

## 开发之前基础准备

### 项目基础准备

#### 使用`create-react-app`脚手架创建 React 项目

```bash
npx create-react-app tao-piao
```

#### 配置编辑器 Linter

在项目根目录新建`.editorconfig`并编写 coding 规范(换行符, 缩进等)

#### 配置调试环境

1. 在应用中打测试断点
2. VS Code -> Debug -> Launch Chrome 生成 `.vscode/launch.json`文件并修改`url`中的端口号为 3000
3. restart 应用, 程序运行至断点处停止说明调试环境 OK

#### 配置 ESlint

```javascript
npm install -g eslint
```

1. 全局安装后再安装 VS Code 插件 ESlint, 然后输入`command + shif + p`输入`eslint create eslint configuration`交互式配置代码规则。
2. 配置 User Settings, 开启 Eslint 选项`Auto Fix On Save`
3. 新建`.eslintignore`忽略不需要检查的文件

#### 配置 Sass

新版本的`create-react-app`使用 Sass 非常方便只需要

```bash
npm install node-sass -S
```

然后新建`.scss`文件编写样式即可

#### 初始化 CSS

```bash
npm install --save normalize.css
```

main entry file 中`import 'normalize.css';`

#### 预览项目

项目配置完成 , 先`npm run build`构建  生产版本, 然后  通过`server`预览项目, 一切正常则前期准备环境完成。

```bash
npm i -g serve
serve -s build
```

### 需求梳理

### 项目结构梳理

## 开发流程

## 总结


