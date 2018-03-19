---
title: "Cross Origin Resource Sharing"
date: "2018-03-12"
layout: post
draft: false
path: "/posts/Cross-Origin-Resource-Sharing"
category: "HTTP"
tags:
  - "CORS"
description: ""
---
Today many pages on the web load resources like CSS, images and scripts from
separate domains, such as content delivery networks. CORS is a mechanism that
uses additional HTTP headers to let a user agent gain permission to access resources
from different domain as following example: A HTML page served from http://domain-a.com
makes an `<img>` src request for http://domain-b.com/image.jpg

本文以一个例子说明如何解决跨域的问题.

## 问题
假设一个登陆模块, 当用户填写好登陆信息并点击确定时, 该模块会向服务器端发送登陆请求.
![9fxMAU.png](https://s1.ax1x.com/2018/03/13/9fxMAU.png)
```javascript
var jqxhr = $.post('http://localhost:4002/user/login', {
           username: $('#username').val(),
           password: $('#password').val()
...
```
但此时, 由于端口号不同，产生了跨域的问题, 该请求无法访问服务器. 浏览器会提示错误信息:
![9hS6Tf.png](https://s1.ax1x.com/2018/03/13/9hS6Tf.png)

## 解决方案
在服务器端添加跨域支持，也就是通过设置 Access-Control-Allow-Origin: `允许谁访问`.  
以`Koa`为例:
安装跨域支持的middleware  
```bash
npm i --save koa-cors
```
并在程序中添加加载
```javascript
const cors = require('koa-cors');
app.use(cors());
```
再次访问服务器端时, 请求没有被拒绝, 服务器端返回用户名.
![9h97JU.png](https://s1.ax1x.com/2018/03/13/9h97JU.png)

[完整的示例](https://github.com/evle/koa-cors-demo)
