---
title: 适配器模式
---
# 适配器模式

## 什么是适配器模式

### 意图
适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。  

适配器模式是一种“亡羊补牢”的模式，一般不会在程序设计之初就使用它。而是未来某天旧的接口不适用于新的需求或新系统，这时才需要适配器模式把旧接口包装成一个新的接口，使它继续保持生命力。  
  
## 实践

### 例子1
现在假设使用Google和百度地图时，渲染是这样的。  
```js
let googleMap = {
  show: function() {
    console.log('开始渲染谷歌地图')
  }
}

let baiduMap = {
  show: function() {
    console.log('开始渲染百度地图')
  }
}
```
然后我们写出render函数来调用
```js
let renderMap = function(map) {
  if(mao.show instanceof Function) map.show()
}
renderMap(googleMap)  // 开始渲染谷歌地图
renderMap(baiduMap) // 开始渲染百度地图
```
这里这所以能顺利的运行是因为谷歌地图和百度地图都提供了一致的函数 show 来对地图进行渲染。但是万一哪天百度说不玩了，我要改成 display 来显示。那这样如何是好？难道我们要去把相应的调用都改吗？  
不需要，我们只需要用适配器模式修改一个地方即可。    
```js
let baiduMapAdapter = {
  show: function() {
    return baiduMap.display()
  }
}

renderMap(baiduMapAdapter) // 开始渲染百度地图
```

### 例子2
例子1里面，我们给函数做了适配。那么要是数据呢？我们也可以利用这个思维去做实现。  

假设某个接口返回给我们的数据是这样的
```js
let getTableList = function() {
  return [
    {id: 1, name: '张三'},
    {id: 2, name: '李四'}
  ]
}

let render = function(fn) {
  fn() // 渲染到视图
}
render(getTableList)
```
然后我们按这样的需求去编写好了代码，把数据成功渲染到页面上。但是突然有一天，我们需要用到新的接口了，而且新的接口返回的数据跟这里完全不一致。
```js
let getTableList2 = function() {
  return {
    '张三': 1,
    '李四': 2
  }
}
```
那现在怎么办？如果我们按照新的数据结构去修改渲染代码，那可是一种很大的工程量。这时就需要适配器来把新的数据适配回旧的。  
```js
let dataAdapter = function(newFn) {
  let arr = []
  newData = newFn()
  for(key in newData){
    arr.push({id: newData[key], name: key})
  }
  return function() {
    return arr
  }
}

render(dataAdapter(getTableList2))
```

