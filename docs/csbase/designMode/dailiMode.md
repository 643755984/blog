---
title: 代理模式
---
# 代理模式

## 什么是代理模式
### 意图
当客户不方便直接访问一个对象或不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求作出一些处理后，再把请求转交给本体对象。  

### 常见的代理模式
* 防火墙代理：控制网络资源的访问，保护主题不让”坏人“接近
* 远程代理：为一个对象在不同的地址空间提供局部代表。
* 保护代理：用于对象应该有不同反问权限的情况
* 智能引用代理：取代了简单的指针，它在访问对象时执行一些附加操作，比如计算一个对象被引用的次数
* 虚拟代理：虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建
* 缓存代理：缓存一些开销较大的结果，让其下次访问时，可以直接从缓存中获取  

而在 JavaScript 中使用最常见的就是虚拟代理和缓存代理

## 例子

### 虚拟代理
在图片加载过程中，如果图片过大、过于多又或者网速慢的情况下，经常会造成网页上一些页面出现空白得情况。而最常见的做法是先用一张loading图片占位，然后用异步的方式加载图片，等图片加载好了再把它填充到img结点里。这种场景就很适合使用虚拟代理。  

首先创建一个加载图片的本体对象
```js
let myImage = (function(){
  let imgNode = document.createElment('img')
  document.body.appendChild('imgNode')

  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()
```
这时 myImage 还没使用代理模式，当调用 myImage.setSrc() 时，就只是直接的给 src 赋值，并没有任何的优化。此时我们加入代理模式，给 myImage 添加新的功能。  

```js
let proxyImage = (function(){
  let img = new Image;
  img.onload = function() {
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('loading.jpg')
      img.src = src
    }
  }
})()

proxyImage.setSrc('图片链接')
```
这里我们通过 proxyImage 间接地访问 myImage。proxyImage 控制了客户对 myImage 的访问，并且在此过程中加入一些额外的操作。  
而且我们可以注意到代理的接口和本体的接口是保持一致性的，这样做的好处在于  
* 用户可以放心地请求代理，他只关心是否能得到想要的结果
* 在任何使用本体的地方都可以替换成使用代理

### 缓存代理
缓存代理就如同他的名字一样，通过对代理对象处理的结果进行缓存。等待下一次调用时就可以直接返回缓存结果，从而节省了大量计算时间。从算法的角度上来讲就是空间换时间。  

首先我们先写一个简单的求乘积的函数
```js
let mult = function() {
  let a = 1
  for(let i=0, l = arguments.length;i<l;i++>) {
    a = a * arguments[i]
  }
  return a
}
mult(2, 3)  // 6
```
然后加入缓存代理模式
```js
let proxyMult = (function() {
  let cache = {}
  return function() {
    let args = Array.prototype.join.call(arguments, ',')
    if(args in cache) { // 判断缓存表中是否已缓存过
      return cache[args]
    }
    return cache[args] = mult.apply(this, arguments)
  }
})()

proxyMult(1, 2, 3, 4)  // 24
```
当第二次调用 proxyMult 计算相同的乘积时，就会从缓存当中提取结果返回，而不是从新计算。  

当然我们可以进一步封装一下，让缓存代理模式可以随意传入一个计算函数进行代理。  
```js
let createProxyFactory = function(fn) {
  let cache = {}
  return function() {
    let args = Array.prototype.join.call(arguments, ',')
    if(args in cache) { // 判断缓存表中是否已缓存过
      return cache[args]
    }
    return cache[args] = fn.apply(this, arguments)
  }
}

let proxyMult = createProxyFactory(mult)
```