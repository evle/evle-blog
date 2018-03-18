---
title: "搭建GraphQL Server"
date: "2018-03-15"
layout: post
draft: false
path: "/posts/GraphQL-Express-Server"
category: "GraphQL"
tags:
  - GraphQL
  - Express
description: ""
---
> GraphQL is the future     

关于为什么使用GraphQL？Facebook在2012年就开始用了，跟着用就对了！REST的场景都能使用GraphQL代替，最明显的好处就是 通过GraphQL获取数据的时候 避免了 Over-Fetching 加快了获取数据的速度. 接下来我们要搭建一个 GraphQL服务器, 感受下如果使用GraphQL增删改查数据.

GraphQL有几个核心概念: **Schema**、**Resolvers**、**Mutation**、**Query**. Schema定义了数据结构、Query和Mutation. GraphQL 客户端与GraphQL服务器通信通过queries和mutations. 用REST做对比的话，Query对应`GET`请求，Mutation对应`POST`、`PUT`、`Delete`请求. Resolvers 是数据和Schema之间的链接，也就是实现数据库的操作.

首先编写Schema (Schema.js):
```JavaScript
const typeDefs =`
  type Channel{
    id: ID!     # "!" means ID is required
    name: String
  }
  type Query{
        channels: [Channel]
        channel(id: ID!): Channel
  }
  type Mutation {
     # A mutation to add a new channel to the list of channels
     addChannel(name: String!): Channel
     delChannel(id: ID!): Channel
     updateChannel(id: ID!, name: String!): Channel
 }  
`;
```
定义好了数据结构以及CRUD操作之后我们需要编写resolver来实现这些操作(resolver.js)
```JavaScript
...
const resolvers = {
    Query: {
        channels: () => {
            return channels;
        },
        channel:(root, { id }) => {
            return channels.find(channel => channel.id == id);
        },
    },
    Mutation: {
        addChannel: (root, args) => {
            const newChannel = { id: nextId++, name: args.name };
            channels.push(newChannel);
            return newChannel;
        },
        delChannel: (root, args) => {
            // return channels.d(channel => channel.id === args.id);
            channels.forEach((channel, i) => {
                if(channel.id === args.id){
                    channels.splice(i, 1);
                }
            })
        },
        updateChannel: (root, args) => {
            channels.forEach((channel, i) => {
                if(channel.id == args.id){
                    channel.name = args.name
                }
            })
        }
    }
};
```
接下来编写GraphQL服务器代码, 搭建服务器时我们需要使用Express框架和ES6的语法所以我们先建立一个Express项目并且配置下babel转码.
1. 安装所需的包
```bash
$ npm init -y
$ npm i --save body-parser cors express graphql graphql-server-express graphql-tools
$ npm i --save-dev babel-cli babel-preset-es2015
```
2. 建立如下项目结构
```bash
app/
├── src/
    └── resolvers.js
    └── schema.js
├──server.js
├──.babelrc
├── package.json
├── node_modules/
```
3. 配置babel(.babelrc)
```json
{
    "presets": [
        "es2015"
    ]
}
```
并配置下启动命令(package.json)
```json
...
"scripts": {
   "start": "babel-node server.js"
 },
...
```

4. 编写服务器代码
```JavaScript
import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress, } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { schema } from './src/schema';
const PORT = 7700;  
const server = express();  
server.use('*', cors({ origin: 'http://localhost:8000' })); //Restrict the client-origin for security reasons.
server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema
}));
server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));
server.listen(PORT, () =>
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
);
```

到此, 我们可以通过`http://localhost:7700/graphiql`访问我们搭建好的GraphQL服务器了.
![95gKdx.png](https://s1.ax1x.com/2018/03/16/95gKdx.png)

如果遇到问题请查看[完整代码](https://github.com/evle/graphql-server-express)
