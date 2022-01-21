---
title: 享元模式
description: 'JS的享元模式'
---
# 享元模式

## 什么是享元模式
享元模式是一种用于性能优化的模式。主要要求将对象的属性划分为内部状态与外部状态（通常指属性），然后在新建对象时是根据内部状态的数量来新建，从而能达到减少对象的产生，减少共享对象的数量。  

### 主要解决
在有大量对象时，有可能会造成内存溢出，我们把其中共同的部分抽象出来，如果有相同的业务请求，直接返回在内存中已有的对象，避免重新创建。  

### 如何划分内部状态和外部状态
* 内部状态存储于对象内部
* 内部状态可以被一些对象共享
* 内部状态独立于具体的场景，通常不会改变
* 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

### 优点
大大减少了对象的创建，降低了程序内存的占用，提高效率

### 缺点
提高了系统的复杂度，需要分离出内部状态和外部状态。

## 例子
如果让你来写一个五子棋的棋子对象，你会怎么写？这个简单啦，于是你哗啦啦地迅速写出了一个棋子的对象
```js
function Pieces(color, x, y, width, height) {
  this.color = color
  this.x = x
  this.y = y
  this.width = width
  this.height = height
}
```
这个对象咋一看没有任何问题，但是五子棋总共可以放下 225 颗棋子，也就是说后期要创建200个左右的棋子对象。所以想要优化，这就得我们的享元模式登场了。  
先是提出内部元素可以得到 颜色 宽度和高度通常是不会变得。
```js
function Pieces(color, width, height) {
  this.color = color
  this.width = width
  this.height = height
}

```
然后在定义一个工厂来对对象进行实例化
```js
let PiecesFactory = (function() {
  let createdFlyWeightObjs = {}
  return {
    create: function(color, width, height) {
      if(createdFlyWeightObjs[color]) {
        return createdFlyWeightObjs[color]
      }
      return createdFlyWeightObjs[color] = new Pieces(color, width, height)
    }
  }
})
```
工厂能根据我们的颜色要求返回实例对象，在这里一共只有黑白两种颜色，也就是说只会实例两个对象。  
在创建一个管理器封装外部状态
```js
let piecesManager = (function() {
  let piecesDatabase = {} // 用于保存所有棋子的外部状态
  return {
    down: function(id, color, x, y){
      let flyWeightObj = PiecesFactory(color)
      let dom = document.createElement('div')  // 创建棋子的DOM

      // 中间省略棋子添加进DOM和设置属性

      piecesDatabase[id] = {
        x,
        y,
        dom
      }
      return flyWeightObj
    }
  }
})()
```
就这样，一个基本的享元模式就实现了。在使用享元模式之前，一盘的棋局要创建上百个Pieces对象，但是使用享元模式后，只需要创建两个Pieces对象。
