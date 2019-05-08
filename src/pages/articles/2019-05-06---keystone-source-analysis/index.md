---
title: 'keystone source analysis'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/keystone-source-analysis'
category: 'NodeJS'
tags:
  - NodeJS
description: ''
---

Keystone.js 是一个基于 Node.js 的 Web 框架，用于快速开发博客，论坛，网站或者任意形式的管理系统。

特性

Session Management: 开箱即用的 session 管理和授权登陆功能

Routing: 自定义访问路径

Modularity: 模块化 j 开发

Admin UI: 自动生成管理界面，简单方便的管理数据库信息

keystone.init({

'name': 'My Site',

'brand': 'My Site',

...

})
把 option 拷贝到 \_options

keystone.import('model')
