---
title: "如何使用vue-router"
date: "2017-09-11T01:36:48.284Z"
layout: post
draft: false
path: "/posts/vue-router/"
category: "Vue"
tags:
  - "Vue"
  - "vue-router"
description: "vue-router的使用方法"
---
在讲 **vue-router** 的使用方法之前, 先来分析一下 vue app 中的文件. 以默认项目为例(`vue init webpack vue-app`), 一个 vue app 是由多个 **component** 组成的.

一个 **component** 中包含:
+ templete : 显示给用户的页面元素
+ script : 操作数据(设置, 通信)
+ style : 添加样式(添加scoped属性使样式只对该component生效)

启动程序后, `main.js`开始创建 Vue实例并且挂载到 `index.html`中的`#app` div中. 然后设置`App`为第一个运行的component.

## 静态路由
**App.vue:**
首先, 在`App.vue`中为需要跳转的Item添加连接通过<router-link>如下：
    ```
    <router-link :to="{name:'Home'}">Home </router-link>
    <router-link to="/about">About</router-link>
    ```
在这里我们使用了两种方法分别为Home和About添加了跳转链接, Home使用了一种特别的添加链接的方式, `name`会传递至`router/index.js`中, 从而寻找跳转路径并绑定component. About使用了最常见的链接添加方式.  

**router/index.js**
设置路由: 设置path, name 以及 component.  
    ```
    routes: [
       {
         path: '/home',
         name: 'Home',
         component: Home
       },
       {
         path: '/about',
         name: 'About',
         component: About
       }
     ]
    ```

完成路由设置后，在`components`文件夹中创建路由所绑定的component即可.

## 动态路由
1. 添加跳转链接
**App.vue:**:  
    ```
    <router-link to="/weather/bj">BeiJing</router-link>
    <router-link to="/weather/sh">ShangHai</router-link>
    <router-link to="/weather/gz">Guangzhou</router-link>
    <router-view></router-view>
    ```
2. 设置路由
**router/index.js:**  
    ```
      routes: [
       {
          path: '/weather/:id',
          name: 'Weather',
          component: Weather
        }
      ]
    ```
为了演示动态路由, 我们需用一个http client(本文只使用 *axios*).  
当用户点击 **App.vue** 中的链接时, 链接会携带参数并跳转至 **router/index.js**. 在 **router/index.js** 中, 我们为 **path** 绑定 **component**. 下面来实现 **component** 根据用户传递的城市来获取当前城市的天气状况.  
    ```javascript
        import axios from 'axios'

        export default {
            name: 'Weather',
            data() {
                return {
                    weather: {},
                    city: {},
                    temperature: {},
                    condition: {}
                }
            },

            created() {
                this.fetchData()
            },

            watch: {
                '$route': 'fetchData'
            },

            methods: {
                fetchData() {
                    axios.get('https://weixin.jirengu.com/weather/now?cityid=' + this.$route.params.id)
                        .then((resp) => {
                            this.weather = resp.data.weather[0]
                            this.city = this.weather.city_name
                            this.temperature = this.weather.now.temperature
                            this.condition = this.weather.now.text

                            console.log(resp)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            }
        }
    ```

  该组件在创建时首先调用`fetchData()`从天气API当前城市的天气状况. `$route.params.id`可以获取路由中传递的城市参数. 因为VueRouter组件只渲染一次, 需要添加一个[watch](https://vuejs.org/v2/guide/computed.html#ad) hook手动更新`$route`的变化.  

[点击查看完整代码](https://github.com/evle/vue-router-example)
