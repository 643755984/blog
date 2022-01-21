---
title: 策略模式
---
# 策略模式 

## 什么是策略模式

### 意图
策略模式（Strategy Pattern）定义了一组策略，分别在不同类中封装起来，每种策略都可以根据当前场景相互替换，从而使策略的变化可以独立于操作者。

### 特点
* 多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句
* 策略模式提供了对开闭原则的完美支持，可以在不修改原代码的情况下，灵活增加新算法

### 缺点
* 客户端必须理解所有策略算法的区别，以便适时选择恰当的算法类。
* 策略模式造成很多的策略类。

## 实现策略模式
现在假如播放视频有四种用户：普通用户、VIP用户、VVIP用户和超前点播用户，每一个级别能比前一个级别提前看多三级。那么该如何实现呢？  

### 仅完成需求的代码
首先大家肯定能想到这种编写方式
```js
let canWatch = function(identity, num) {
  if(identity == 'none') {
      return num <= 3
  }
  if(identity == 'VIP') {
      return num <= 6
  }
  if(identity == 'VVIP') {
      return num <= 9
  }
  if(identity == 'advance ') {
      return num <= 12
  }
}
canWatch('VIP', 8) //false
```
这样写有三个缺点：  
* canWatch 函数会过于大
* canWatch 违法开放-封闭原则，如果我想增加多以VVVIP或者修改VIP的特权就必须进入 canWatch函数内部修改
* 复用性差，其它地方不能有选择的复用这些特权判断逻辑。

### 使用组合函数

```js
let identityNone = function(num) {
  return num <=3
}

let identityVIP = function(num) {
  return num <=6
}

let identityVVIP = function(num) {
  return num <=9
}

let identityAdvance = function(num) {
  return num <=12
}

let canWatch = function(identity, num) {
  if(identity == 'none') {
      return identityNone(num)
  }
  if(identity == 'VIP') {
      return identityVIP(num)
  }
  if(identity == 'VVIP') {
      return identityVVIP(num)
  }
  if(identity == 'advance ') {
      return identityAdvance(num)
  }
}
canWatch('VIP', 8) //false
```
使用组合函数来重构代码。将用户的各种特权判断提取到一个单独的函数。能清晰的看到每个级别的特权。但是依然有一个缺点，那就是 canWatch 过于庞大。 

### 策略模式的实现
策略模式的目的就是将操作的使用和操作的实现分离开来。所以一般的策略模式会有两个部分组成：一个策略类，具体封装了操作的实现。第二个就是环境类Context，Context接受用户的请求，然后把请求委托给某一个策略类。

### 传统的面向对象方式实现
```js
let identityNone = function() {}
identityNone.prototype.canWatch = function(num) {
  return num <= 3
}

let identityVIP = function() {}
identityVIP.prototype.canWatch = function(num) {
  return num <= 6
}

let identityVVIP = function() {}
identityVVIP.prototype.canWatch = function(num) {
  return num <= 9
}

let identityAdvance = function() {}
identityAdvance.prototype.canWatch = function(num) {
  return num <= 12
}

let Context = function() {
  this.strategy = null
}

Context.prototype.setIdentity = function(strategy) {
  this.strategy = strategy
}

Context.prototype.getPower = function(num) {
  return this.strategy.canWatch(num)
}

let obj = new Context()
obj.setIdentity(new identityVIP())
console.log(obj.getPower(7))  // false

```

### JavaSscript的实现
在 JavaSscript 中由于函数也是对象，所以更简单和直接的做法就是把 strategy 直接定义为函数：  
```js
let strategies = {
  "None": function(num) {
    return num <= 3
  },
  "VIP": function(num) {
    return num <= 6
  },
  "VVIP": function(num) {
    return num <= 9
  },
  "Advance": function(num) {
    return num <= 12
  }
}
```
同样 Context 也可以由函数来实现：
```js
let context = function(identity, num) {
  return strategies[identity](num)
}

context('VIP', 6)  // true
```
