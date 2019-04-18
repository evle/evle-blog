---
title: "JavaScript设计模式回顾(1/5)"
date: "2018-04-17"
layout: post
draft: true
path: "/posts/js-design-pattern-1"
category: "JavaScript"
tags:
  - Design Pattern
description: ""
---

1. Singleton

类型：Creational Pattern
Frequency of use: high
使用场景：系统中维护一个唯一实例，比如多个玩家打同一个Boss, 任意一个玩家对Boss造成伤害, 其他玩家都会看到Boss的血条减少

```javascript
var Singleton = (function(){
    var instance;

    function createInstance(){
        return new Object();
    }

    return {
        getInstance: function(){
            if(!instance){
                instance = createInstance();
            }
            return instance;
        }
    }
})();

var run = function(){
    var instance1 = Singleton.getInstance();
    var instance2 = Singleton.getInstance();
    console.log(instance1 === instance2);
}
run();
```

2. Adapter

类型：Structural Pattern
Frequency of use: high
使用场景：使接口不兼容的组件可以一同工作

```javascript
// old interface
function Shipping() {
    this.request = function(zipStart, zipEnd, weight) {
        // ...
        return "$49.75";
    }
}
 
// new interface
function AdvancedShipping() {
    this.login = function(credentials) { /* ... */ };
    this.setStart = function(start) { /* ... */ };
    this.setDestination = function(destination) { /* ... */ };
    this.calculate = function(weight) { return "$39.50"; };
}

// adapter interface
function ShippingAdapter(credentials) {
    var shipping = new AdvancedShipping();
    shipping.login(credentials);

    return {
        request: function(zipStart, zipEnd, weight) {
            shipping.setStart(zipStart);
            shipping.setDestination(zipEnd);
            return shipping.calculate(weight);
        }
    };
}

// log helper
var log = (function () {
    var log = "";
    return {
        add: function (msg) { log += msg + "\n"; },
        show: function () { alert(log); log = ""; }
    }
})();

function run() {
    var shipping = new Shipping();
    var credentials = {token: "30a8-6ee1"};
    var adapter = new ShippingAdapter(credentials);

    // original shipping object and interface
    var cost = shipping.request("78701", "10010", "2 lbs");
    log.add("Old cost: " + cost);

    // new shipping object with adapted interface

    cost = adapter.request("78701", "10010", "2 lbs");

    log.add("New cost: " + cost);
    log.show();
}
```

3. Command
Frequency of use: high

4. Composite
Frequency of use: high

5. Iterator
Frequency of use: high
```javascript
var Iterator = function(items) {
    this.index = 0;
    this.items = items;
}
 
Iterator.prototype = {
    first: function() {
        this.reset();
        return this.next();
    },
    next: function() {
        return this.items[this.index++];
    },
    hasNext: function() {
        return this.index <= this.items.length;
    },
    reset: function() {
        this.index = 0;
    },
    each: function(callback) {
        for (var item = this.first(); this.hasNext(); item = this.next()) {
            callback(item);
        }
    }
}
 
// log helper
 
var log = (function() {
    var log = "";
    return {
        add: function(msg) { log += msg + "\n"; },
        show: function() { alert(log); log = ""; }
    }
})();
 
function run() {
    var items = ["one", 2, "circle", true, "Applepie"];
    var iter = new Iterator(items);
 
    // using for loop
 
    for (var item = iter.first(); iter.hasNext(); item = iter.next()) {
        log.add(item);
    }
    log.add("");
 
    // using Iterator's each method
 
    iter.each(function(item) {
        log.add(item);
    });
 
    log.show();
}

run()
```

6. Chain of Responsibility



7. Prototype
8. 