---
title: 深拷贝与浅拷贝
description: '前端的深拷贝与浅拷贝 JS的深拷贝与浅拷贝'
---

# 深拷贝与浅拷贝

如果还没了解数据在JS中是如何保存的，建议先去看数据类型篇后再回来观看。

## 什么是浅拷贝
在 JavaScript 进行 = 号赋值运算时，其实就是浅拷贝。  
```js
var str1 = 'a'
var str2 = str1
console.log(str1) // a
console.log(str2) // a
str1 = 'b'
console.log(str1) // b
console.log(str2) // a
```
浅拷贝有个特点：就是无论是基本类型还是引用类型，都只是对栈的修改。
```js
var obj1 = {
  name: 'zhangsan',
  age: 18
};
var obj2 = obj1;
obj1.name ='lisi';
console.log(obj2.name)  // 'lisi'
```
所以对于对象的拷贝，并没有达到跟浅拷贝基本类型一样的效果
## 什么是深拷贝
深拷贝则是考虑到了对象的问题。竟然栈中保存的是对象的堆地址，那么我新创建一个对象，让栈中有一个新的对象栈，再把旧对象的值全部给新对象不就行了吗？  

没错，所有的深拷贝都是基于这种方法实现的。  

当然实际操作中还需要考虑很多情况，比如 引用类型里面还有引用类型


## 深拷贝的实现

### JSON.stringify 与 JSON.parse
```js
var arr = ['old', 1, true, ['old1', 'old2'], {old: 1}]

var new_arr = JSON.parse( JSON.stringify(arr) );

console.log(new_arr);
```

是一个简单粗暴的好方法，就是有一个问题，不能拷贝函数。

### 使用递归
用递归把所有的引用对象都重新创建并赋值。
```js
var deepCopy = function(obj){
  if(typeof obj !== 'object') return obj;
  var newObj = obj instanceof Array ? [] : {};
  for(var key in obj){
    if(obj.hasOwnproperty(key)){
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}
```
