---
title: "实现Chrome Web Push服务"
date: "2019-03-13"
layout: post
draft: false
path: "/posts/chrome-web-push"
category: "webpush"
tags:
  - webpush
  - JavaScript
description: ""
---

## 介绍

推送类型的广告作为一种新型的广告形式已经兴起很久了, 通过适(欺)当(骗)的文案相比传统Banner广告有着不可思议的转化率。用户很乐意去点击感兴趣的推送而进入我们想让他进入的网站。HTTP Web Push协议中描述Web推送服务的架构如下

[![E9aiMq.md.png](https://s2.ax1x.com/2019/04/19/E9aiMq.md.png)](https://imgchr.com/i/E9aiMq)

在这个架构中我们看可以看到有3个参与者

- UA
- Push Service
- App Server

**UA** 则代表客户端, 客户端发送订阅请求给 **Push Service**， Push Service代表第三方的推送服务比如Google的FCM服务。**App Server**也就是Server端应用。下面让我们详细的分析图中的每一个过程。

## 推送流程

在客户端实现推送需要借助浏览器的Service Worker, 向Push Service发送请求以及接受来自Push Service的推送事件我们都需要调用Service Worker的API, 我们需要使用`navigator.serviceWorker.register('sw.js')`注册一个service worker, `sw.js`也就是一个JS文件, 里面控制了该worker如何工作。当我们调用这个API注册了一个worker后浏览器会做以下三件事情：

1. 下载sw.js
2. 运行sw.js中的代码
3. 返回一个Promise对象(代码运行正常返回resolve,如果异常返回reject)

如果要实现Server端对Client进行消息推送, 要先从Client开始经历一下3个过程。
[![E9wyGQ.md.png](https://s2.ax1x.com/2019/04/19/E9wyGQ.md.png)](https://imgchr.com/i/E9wyGQ)

第一步是`Get Permission to Send Push Message`, 也就是首先让浏览器允许接受这个域名的推送服务，我们需要调用`Notification.requestPermission()`让浏览器弹出一个通知框，提示是否允许推送，并由用户进行选择。默认情况下该值是`default`会弹出通知框让用户选择, 但如果是`grante`或`denied`则不会弹出通知框。

当用户选择允许后, 就可以进行第二步 `Get PushSubscription`, 从开篇介绍中的架构图中，我们可以看到浏览器向Push Service发出subscribe请求,这就是第二步做的事情。通过调用`registration.pushManager.subscribe(options)`向Push Service发送订阅请求

```javascript
 const Options = {
      applicationServerKey: urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    };
registration.pushManager.subscribe(Options)
```

`Options`中的`applicationServerKey`是由 VAPID spec标准定义的一个规范所生成的public key, 我们可以用`web-push`生成public和private key，把public key放在上面的`applicationServerKey`中。

```javascript
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
```

VAPID标准规定我们要发送一个`Uint8Array`格式的pubilc key到Push Service，所以我们需要使用`urlBase64ToUint8Array`转换一下我们上面生成的public key.

```javascript
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

当我们调用`registration.pushManager.subscribe(options)`后，浏览器会把这个public key发送给 Push Service, Push Service会用这个public key生成一个 **endpoint** 并返回给浏览器。浏览器会得到以下格式的对象称为`PushSubscription`。

```javascript
{
  "endpoint": "https://random-push-service.com/some-kind-of-unique-id-1234/v2/",
  "keys": {
    "p256dh" :
"BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
    "auth"   : "tBHItJI5svbpez7KI4CCXg=="
  }
}
```

这个**PushSubscription**相当于该浏览器ID, 第三步我们需要将这个ID发送至我们的后端应用保存起来, 以后我们需要将推送内容发送给这个ID来实现推送功能。在保存该信息时我们应该附带保存一些当前浏览器的信息比如UA、Platform等其他信息以便于在后端统计以及分类。

当后端应用收到这个 **PushSubscription** 后就可以任意时候给客户端推送消息了。具体流程如下：

[![E9gHzT.md.png](https://s2.ax1x.com/2019/04/19/E9gHzT.md.png)](https://imgchr.com/i/E9gHzT)

后端实现推送我们依旧可以使用刚才生成VAPID的`web-push`库，使用这个库实现推送我们只需要依次调用这个方法`setGCMAPIKey`, `setVapidDetails`和`sendNotification`。

`setGCMAPIKey`就是把在第三方推送服务比如FCM申请到的API Key保存起来

```javascript
let gcmAPIKey = '';
WebPushLib.prototype.setGCMAPIKey = function(apiKey) {
  if (apiKey === null) {
    gcmAPIKey = null;
    return;
  }
  gcmAPIKey = apiKey;
};
```

`setVapidDetails`的作用是在推送消息给浏览器之前对public key和private key的格式进行验证

```javascript
WebPushLib.prototype.setVapidDetails = function(subject, publicKey, privateKey) {
    vapidHelper.validateSubject(subject);
    vapidHelper.validatePublicKey(publicKey);
    vapidHelper.validatePrivateKey(privateKey);
    ...
}
```

`sendNotification`是将这个请求发送出去，发送的第一步正如上图中第一步将签名信息包括private key加在请求的`header`中，其中重要的方法是`generateRequestDetails`将签名信息放在header里面

```javascript
 const requestDetails = {
      method: 'POST',
      headers: {
        TTL: timeToLive
      }
    };
requestDetails.headers['Content-Length'] = encrypted.cipherText.length;
requestDetails.headers['Content-Type'] = 'application/octet-stream';
requestDetails.headers['Content-Encoding'] = AES_GCM;
requestDetails.headers['Crypto-Key'] = KEY;
requestDetails.headers.Authorization = 'key=' + KEY;
```

设置完header头之后，该方法最后调用Nodejs原生API `https.request` 给`PushSubscription`中的`endpoint`发送POST请求，也就是完成了上图流程中的第二步。

第三步就是Push Service要处理的事情了， Push Service会收到private key并且来找与它匹配的public key, 找到后会回应后端应用推送成功并且将推送内容发送至浏览器。

因为浏览器中有我们之前注册的service worker, service worker会收到`push`事件, 但是我们无法控制servie worker的代码何时运行，因为是浏览器决定它什么时候唤醒, 什么时候终止, 因此我们需要将一个Promise对象传递给`event.waitUntil()`来保持service worker一直运行，直到Promise被`resolve`。此外我们通常在浏览器收到推送时，将浏览器收到推送的事件上报给服务器，那么我们可以将上报给服务器的代码也封装成一个Promise, 用`Promise.all`处理后在传递给`event.waitUntil()`

```javascript
self.addEventListener('push', function(event) {
  const analyticsPromise = pushReceivedTracking();
  const pushInfoPromise = fetch('/api/get-more-data')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      const title = response.data.userName + ' says...';
      const message = response.data.message;

      return self.registration.showNotification(title, {
        body: message
      });
    });

  const promiseChain = Promise.all([
    analyticsPromise,
    pushInfoPromise
  ]);

  event.waitUntil(promiseChain);
});
```

这里要注意的是必须在Promise中**return** `self.registration.showNotification`。 我们收到该事件后需要调用`self.registration.showNotification`来展示服务器推送的内容。服务器推送的内容应该是下面这样一个对象, 通常我们在开发中需要配置一个素材服务器来管理给客户端推送的内容。

```javascript
{
  "body": "Did you make a $1,000,000 purchase at Dr. Evil...",
  "icon": "images/ccard.png",
  "vibrate": [200, 100, 200, 100, 200, 100, 400],
  "tag": "request",
  ...
}
```

上面对象中的属性分别对应浏览器通知栏的这些位置
![E9hxGn.png](https://s2.ax1x.com/2019/04/19/E9hxGn.png)

至此, 完整的一个推送流程就结束了。

## 策略

当实现了推送服务后我们需要让用户订阅我们的服务, 我们需要诱惑用户心理来订阅我们的服务, 当用户调用`Notification.requestPermission()`时，如果用户点击了拒绝, 那么该浏览器除非用户手动再次设置，否则永远无法接收我们的推送，所以我们不能冒险直接调用该接口, 我们有以下三种策略来提高用户的订阅率：

- 纯诱导订阅: 最基本的比如做一个假的视频播放页面并且起个劲爆标题，增加用户点击视频播放按钮的欲望, 当用户点击后调用`requestPermission()`接口弹出授权提示让用户选择点击Allow后即可观看。

- 试探订阅: 先做一些假的推送框, 让用户选择是否推送，以此来判断用户接受推送的意愿，如果用户点击了假推送框的Allow, 那么我们则调用
`requestPermission()`, 这时用户是极大概率接着点真Allow的。如果用户不愿意，则继续用其他假的推送框试探用户。

- 被动订阅：直接在页面中添加一个是否允许订阅的开关，如果用户觉得站点内容有价值，自然会点击允许开关，此时调用`requestPermission()`

原则就是不要让用户点拒绝, 这样意味着这个用户将永远的失去。还要注意的是推送的内容一定要“适当“, 这是我之前做的推送,高仿社交App，用户的点击率还是很高的。

[![E9HsFU.png](https://s2.ax1x.com/2019/04/19/E9HsFU.png)](https://imgchr.com/i/E9HsFU)