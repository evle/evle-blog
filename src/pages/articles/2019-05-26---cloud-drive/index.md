---
title: "云盘无刷新上传实现"
date: "2019-05-26"
layout: post
draft: false
path: "/posts/cloud-drive"
category: "HTML5"
tags:
  - HTML5
description: ""
---

拖拽  文本 图片 链接
drag
drop

设置拖拽属性 draggable
监听事件（被拖动 可放置） dragstart drag 

drageenter over leave drop

drop触发： 在dropover中 preventDefault() 把元素变为放置元素

拖放给 放置传递数据 dataTransfer  和lcoalstroage使用一样 setData getData

比如把A放B

doucumentElement HTML

防止浏览器默认行为 打开
preventDefault
stopPropgation 

拖拽数据

无刷新
file + ajax

file 用formdata对象传二进制

e.dataTransfer.files array like

上传进度 ajax

xhr.upload.onprogress 
e.total
e.loaded

xhr.upload.onload 上传成功

断点续传
和传输超时


支持文件夹
entry = item.webkitGetAsEntry()
entry.file(f=>{

})

entry.isFile
isDirectory

//读文件夹
let reader = entry.createReader()
reader.readEntries(
  redFile
)


响应式布局

@media (max-width:1000px){
    div{background:blue;}
}
@media (min-width:1000px) and (max-width:1150px){
    div{background: yellow;}
}
@media only screen and (max-width:1150px){
    div{border:solid 1px;}
}
@media not print and (max-width:1150px){
    div{border-radius:50%;}
}
