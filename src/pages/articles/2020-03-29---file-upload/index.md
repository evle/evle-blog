---
title: "文件上传最佳实践"
date: "2020-03-29"
layout: post
draft: false
path: "/posts/file-upload"
category: "Node.js"
tags:
  - 
description: ""
---

本篇文章实现一个文件上传的功能, 有以下特性:

- 断点续传
- 重复文件秒传
- 小文件整体上传
- 大文件分片上传
- 断点续传(单个分片续传和浏览器刷新续传)
- 暂停和恢复

技术栈为 React + Node.js， 废话不多说, 开始操作

## 前端部分

前端部分梳理需求如下:

- 选择图片上传后应该有预览功能
- 选择文件的合法性:
  - 如果没选择上传文件, 则提示没选择文件
  - 如果上传类型不允许, 则提示不支持该文件
  - 如果上传文件大小超过限制, 则提示不支持该文件
- 上传进度条提示
- web worker切片上传
- 断点续传



```javascript

function Upload(){
  let [currentFile, setCurrentFile] = useState<File>();
  
  useEffect(()=>{
    window.URL.createObjectURL(currentFile)
  },[currentFile])
}
```

## 后端部分 
 
分片上传


