---
title: "创业团队的应用部署流程"
date: "2020-04-01"
layout: post
draft: true
path: "/posts/classic-deployment"
category: "web"
tags:
  - 
description: ""
---

创业公司的产品是在做迭代, 验证想法, 做prototype, 从这个过程中, 找到产品的"点".

本篇文章实现一个最小化

当开发者提交代码到git server时候, git server会触发webhooks通知 CICD服务器, 

webhooks playload:
http://ip/webhook

webhook.js

```javascript
const http = require('http');
const crypto = require('crypto');

const SECRET = 'evle';

function sign(body){
  return `sha1=` + crypto.createHmac('sha1', SECRET).update(body).digest('hex');
}

let server = http.createServer((req, res)=>{
  if(req.method == 'POST' && req.url == '/webhook'){
    let chunk = [];
    req.on('data', (data)=>{
      chunk.push(arr)
    })

    req.on('end', ()=>{
      let body = uffer.concat(chunk);
      let event = req.header['x-github-event'] // event = push
      let sign = req.headers['x-hub-signature'];
      if(sign === sign(body)){
        
      }
      
    })

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ok:true}))
  }else{
    res.end('Not Found')
  }
})
server.listen(port)
```

