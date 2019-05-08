---
title: 'nodejs stream'
date: '2019-05-06'
layout: post
draft: true
path: '/posts/nodejs-stream'
category: 'NodeJS'
tags:
  - NodeJS
description: ''
---

fs.readdir(\_\_dirname, (err, files) => {
console.log(files);
// console.log: 在指定字符串后加上‘\n’, 并写到 stdout 流中

    process.stdout.write('Hello');

})
可读流: stdin

可写流: stdout, stderr

stdin 默认状态是 paused 等待接收用户输入的数据

流的另外一个属性是它的默认编码

process.argv 运行时参数 第一个元素始终是 node 第二个元素始终是执行文件路径 紧接着命令行参数

所以一般取命令行参数 先去掉前两个 let args = process.argv.slice(2)

获取 2 个不同的目录 程序本身的目录 \_\_dirname 程序运行时的目录 process.cwd process.chdir('/')

环境变量 process.env 变量访问环境变量

console.log('An error occurred'); process.exit(1); 退出并提供推出码

信号 进程和 OS 通信 举例： 终止进程 SIGKILL

process.on('SIGKILL', ()=>console.log('end'))

ANSI

fs 读取大文件 readFile writeFile 一次操作不了那么大内存 要用流 stream

一次读取一块 结尾用\n 来切分

const stream = fs.createReadStream('filename') stream.on('data', chunk => { // process }) stream.on('end', chunk => { // process })

大视频传到某个 web 服务器， 无需读取完整个视频再开始上传，使用 Stream 可以提高上传速度

日志系统，无需频繁的打开／关闭文件（查找），只要打开一次

nodejs base64 互转
console.log(Buffer.from('Hello World!').toString('base64'));
console.log(Buffer.from(b64Encoded, 'base64').toString());
