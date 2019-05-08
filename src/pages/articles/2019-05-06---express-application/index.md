---
title: 'express application'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/express-application'
category: 'Express'
tags:
  - Express
  - NodeJS
description: ''
---

获取参数 3 种方法

Checks route params (req.params), ex: /user/:id req.params.id
Checks query string params (req.query), ex: ?id=12 req.query.id
Checks urlencoded body params (req.body), ex: id= req.body.id

url 转换路径问题

var url = require('url');
console.log(url.resolve('/one/two/three', 'four')); // '/one/two/four'
console.log(url.resolve('http://example.com/', '/one')); // 'http://example.com/one'
console.log(url.resolve('http://example.com/one', '/two')); // 'http://example.com/two'
