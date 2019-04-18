---
title: "Chrome Web Push原理及实现"
date: "2019-04-13"
layout: post
draft: true
path: "/posts/chrome-web-push"
category: ""
tags:
  - 
description: ""
---

推送类广告作为一种新型的广告形式已经兴起很久了, 通过适(欺)当(骗)的文案相比传统Banner广告有着不可思议的转化率。通过对之前做的Chrome移动端推送广告服务总结。

 

1. 添加客户端侧的逻辑来给用户订阅推送（也就是使用 Web App 当中的 JavaScript 和 UI，帮助用户注册推送消息）。
订阅用户

- Get Permission 让浏览器允许接受这个域名的弹窗
- 用户设备ID PushSubscription  发送给服务器    服务器往这个ID推就好了


3. 从你的后台/应用调用 API 来触发推送消息到用户的设备。
server -> webpush protocol request ->push service -> device


4. 当推送到达用户的设备时，service worker 可以接收到“推送事件”，通过使用 service worker 你将展示出一个通知。
浏览器会接收到这条消息，解密数据，并且会在你的 service worker 中触发一个推送事件。

service woker 浏览器没打开 浏览器依然可以执行JS 

web-push
