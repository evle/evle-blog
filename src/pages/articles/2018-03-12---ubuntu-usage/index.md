---
title: "Ubuntu 开发环境配置及使用"
date: "2018-03-12"
layout: post
draft: false
path: "/posts/ubuntu-usage"
category: "Ubuntu"
tags:
  - "Ubuntu"
description: ""
---

已经很久没有使用Ubuntu系统了, 但`Docker`和`EC2`上经常会使用Ubuntu的Image或者Instance进行
开发.本文记录下在使用Ubuntu系统进行开发时常用的命令和服务配置.

## 服务配置
## Node.js
```bash
$ sudo apt-get update
$ sudo apt-get upgrade -y
$ sudo apt-get install build-essential libssh-dev git-core -y
$ sudo apt-get install git
$ curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

### Mongdob
```bash
# Download and Install
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

$ echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

$ sudo apt-get update

$ sudo apt-get install -y mongodb-org

# Start MongoDB and add its as service to be started at boot time
$ systemctl start mongod
$ systemctl enable mongod

# Check
$ netstat -plntu

# Configure MongoDb username and password
$ export LC_ALL=C
$ mongo

$ use admin

# Create User
$ db.createUser({user:"admin", pwd:"admin123", roles:[{role:"root", db:"admin"}]})

# Enable MngoDB authentication
$ vim /lib/systemd/system/mongod.service
ExecStart=/usr/bin/mongod --quiet --auth --config /etc/mongod.conf

# Restart service and MongoDB
$ systemd daemon-reload
$ sudo service mongod restart

# Connect to MongoDB
$ mongo -u admin -p admin123 --authenticationDatabase admin
```

<<<<<<< HEAD
## Vim
```bash
# 全部删除
dG
# 全部复制
ggyG
# 首行
gg
# 尾行
G
# 删除当前行
dd
# 拷贝当前行
yy


```

=======
>>>>>>> 20cb9b60c1690dee5a7d460bfda45c5537af435c
## 命令行工具
### curl
普通下载文件:
`curl -LO https://github.com/ziyaddin/xampp/archive/master.zip`
或者 `wget https://github.com/ziyaddin/xampp/archive/master.zip`
只打印响应头部信息:
`curl -I http://www.google.com`
### 防火墙停止/启动
Disable:
`sudo ufw disable`
Enable:
`sudo ufw enable`
