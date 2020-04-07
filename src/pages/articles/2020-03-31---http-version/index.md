---
title: "http version"
date: "2020-02-11"
layout: post
draft: true
path: "/posts/http-version"
category: ""
tags:
  - 
description: ""
---

http大致经历了0.9、1.0 1.1 2.0

0.9的http只支持get请求, 请求 a b两个资源 需要建立2次连接

 http 1.0是因为不仅仅html了 还要加载script, image, css 要请求资源很多 建立多次连接慢
 建立连接慢是因为：1.3次握手 2.tcp slow start 防止网络阻塞 先传小的 后传大的，最后到峰值
 比如你下载东西的时候

 长连接 keep-alive: 长连接必须等上一次请求完毕 才能下一个请求 叫做穿行

http1.0长连接需要content-length 来判断接收完没有 静态文件
1.1 contentlength  或者transfer-encoding：chunked

 pipelining：可以同时请求 但是响应时候必须 按照顺序  队头阻塞

 google spdy 去除了这个限制 并行

 http2 多路复用

 
