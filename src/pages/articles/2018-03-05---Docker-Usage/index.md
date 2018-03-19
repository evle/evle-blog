---
title: "Dockerizing a Node.js web app"
date: "2018-03-05"
layout: post
draft: false
path: "/posts/Docker-Usage"
category: "Docker"
tags:
  - "Docker"
description: ""
---
为了快速构建一个web app, 先安装`express-generator`.
```JavaScript
$ npm install express-generator -g
```
然后使用`express app-name`生成一个express应用.
接下来我们将刚才构建好的应用放在docker里运行.

## 创建`Dockerfile`
```Dockerfile
FROM node:8.9-alpine

ADD . /app/

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
```
以及`.dockerignore`文件
```bash
node_modules
npm-debug.log
```
## 构建image
```JavaScript
$ docker build -t node_express .
```

## 运行image
```JavaScript
$ docker run -d -p 9000:3000 node_express
```

## 删除image
```bash
docker kill (docker ps -q)
docker rm  (docker ps -a -q)
docker rmi (docker images -q -a)
```
