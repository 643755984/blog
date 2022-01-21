---
title: 单例模式
---
# 单例模式

## 什么是单例模式

### 意图
保证一个类仅有一个实例，并提供一个访问它的全局访问点。避免了一个全局使用的类频繁地创建与销毁。  

### 模式特点
* 类只有一个实例
* 全局可访问该实例
* 自行实例化
* 可推迟实例化（即在需要用到的时候）

## 最简单的实现
```js
function Person (name) {
  this.name = name;
}
let single = (function getSingleObj() {
  let instance = null;
  return function() {
      if(!instance) {
          instance = new Person('张三');
      }
      return instance;
  }
})()
let a = single();
let b = single();
console.log(a === b) // true
```
如果你懂的闭包原理的话，那么就很明显能看出，单例模式就是使用了闭包。
用闭包保存了instance，致使你每次调用single函数都是访问的同一个instance。 


## 使用类的静态实现
```js
function Person (name) {
    this.name = name;
}
class Single {
    static getObj() {
        if(!Single.instance) {
            Single.instance = new Person('张三');
        }
        return Single.instance;
    }
}
let a = Single.getObj();
let b = Single.getObj();
console.log(a == b);
```
使用类的静态来实现，其实就是在类的原型上挂载了一个instance属性，每次访问的都是从类（构造函数）原型上访问instance属性。

个人觉得使用类的静态来实现，代码更加简洁直观。

## 应用场景

### Vuex
我们在 Vue 里面安装 Vuex 时，其实就是使用了单例模式的思维来安装 Vuex。
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)  

```
Vue 的use函数其实就是调用 Vuex 里面的Install函数
```js
// Vuex
export function install (_Vue) {
  // 判断Vue是否已经 install Vuex
  if (Vue && _Vue === Vue) { 
    if (__DEV__) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue    // 若没有，那么则为这个 Vue 实例对象 install Vuex
  applyMixin(Vue)
}
```