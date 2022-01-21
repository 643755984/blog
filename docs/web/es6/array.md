---
title: ES6数组的扩展
---

# ES6数组的扩展

## 扩展运算符
扩展运算符（spread）是三个点（...），作用是将一个数组转为用逗号分隔的参数序列。  

用于解构数组：
```js
console.log(...[1, 2, 3])
// 1 2 3
```

用于数组赋值：
```js
let arr1 = [1, 2]
let arr2 = [...arr1]
```

用于合并数组（不过都只是浅拷贝）：
```js
let arr1 = [1, 2]
let arr2 = [3, 4]
let arr3 = [...arr1, ...arr2]
```

## Array.from()
Array.from方法用于将对象转成数组。不过只限于两类的对象，分别是：类似数组（所谓类似数组的对象，本质特征只有一点，即必须有length属性。）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）  

一般只常用于arguments对象和查找DOM返回的类数组  
```js
let obj = {
  '0': 1,
  '1': 2,
  length: 2
}
console.log(Array.from(obj))
//[1, 2]
```

可接受第二个参数，对每个元素进行处理： 
```js
let obj = {
  '0': 1,
  '1': 2,
  length: 2
}
console.log(Array.from(obj, x => x * x))
//[1, 4]
```

## Array.of()
Array.of()方法用于将一组值，转换为数组。  
```js
Array.of(1, 2, 3) // [1, 2, 3]
```

## 实例方法find()和findIndex()
find：用于查找出第一个符合条件的数组成员  
```js
[1, 4, -5, 10].find((n) => n < 0)
// -5
```
该方法的回调函数接受三个参数value(值)、index(索引)、arr(原数组)  

findIndex：返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```js
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2
```
该方法的的回调函数接受的三个参数与find一致  

另外，这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。  

## 实例方法includes()
用于查找数组中是否包含某个值，能识别NAN  
```js
[1, 2, 3].includes(2)     // true
```