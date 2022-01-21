---
title: 函数
---

# JS函数

## 高阶函数
想要确认函数是否是高阶函数得满足至少以下两个条件之一：  
* 函数可以作为参数被传递
* 函数可以作为返回值输出  

而 JS 中的函数显然满足高阶函数的条件，所以JS得函数就是高阶函数。

## 创建函数的几种方式 

### 函数声明

```js
fn() // aa

function fn(){
  console.log('aa')
}

fn() // aa
```

用函数声明创建的函数有预解析，优先级高于变量。

### 函数表达式

```js
fn()  //fn is not defined

var fn = function(){
  console.log('aa')
}

fn() // aa
```

用函数表达式声明的函数没有预解析

## 函数的内部属性

### arguments

arguments是一个类数组，包含着所有传入函数的参数。

```js
fucntion fn(num1, num2){
  console.log(aruments[0])  // 1
  console.log(aruments[1])  // 2
}

fn(1, 2)

```
此外arguments还有一个非常实用的属性callee，这是一个指针，指向arguments对象的函数

```js
function fn(num){
  if(num <= 1){
    return 1
  }

  return num * arguments.callee(num - 1)
}

fn(4)  // 24
```
### this

this引用的是函数执行的环境对象。（情况分多钟，我们下节再聊）

