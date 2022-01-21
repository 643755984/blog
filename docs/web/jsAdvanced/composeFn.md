---
title: 组合函数
description: 'JS的组合函数'
---

# 组合函数

## 什么是组合函数
在用Vue写页面的时候，一个页面可以由多个组件组成，也可以说将一个页面拆分成多个组件。而组合函数也是，将一个复杂的函数拆分成过个小问题，最后将小问题组合起来就是一个完整的函数。  

## 组合函数初使用
假如现在有一个需求：  
* 将字符串全部小写转成大写
* 将字符串倒转过来  

那么我们平常代码的编写基本是这样的  
```js
function fn(str) {
    return str.toUpperCase().split('').reverse().join('')
}
console.log(fn('abcdefg'))  //GFEDCBA
```
这样写咋一看没问题，需求全都实现了。但其实里面存在两个问题：  
1. 违反了函数单一原则。fn里面拥有了两个功能：一是转换成大写，二是字符串倒转。  
2. 违反了开发封闭原则。万一有天需求要改变了，变成只要转成大写就行，不需要翻转了，那么需要改变原代码。  

所以接下来根据上面的条件来修改代码  
```js
function upperCaseStr(str) {
  return str.toUpperCase()
}

function reverseStr(str) {
  return str.split('').reverse().join('')
}

// 接下来组合这两个函数
function compose(fn1, fn2){
    return (...args) => {
        return fn1(fn2(...args))
    };
}

let com = compose(upperCaseStr, reverseStr);
console.log(com('abcdefg'))  //GFEDCBA
```
1. 首先将功能拆分成两个函数  
2. 编写一个组合函数 compose
3. 调用组合函数生成一个新的函数 com，这新的函数包含了我们需求所有的功能
4. 调用新函数  
这时候就算需求改成只要大写转换，那么我们可以直接使用 upperCaseStr 函数，跟本不需要修改原函数。  
而且如果添加新的功能，首字母小写。那么我们也可以在原有的基础上添加功能。
```js
function firsetCaseLower(str) {
    let arr = str.split('')
    arr[0] = arr[0].toLowerCase()
    return arr.join('')
}

function compose(fn3, fn1, fn2){
    return (...args) => {
        return fn3(fn1(fn2(...args)))
    };
}

let com = compose(firsetCaseLower, upperCaseStr, reverseStr);
console.log(com('abcdefg'))  //gFEDCBA
```
但是这样写的 compose 明显很不合理，不能自适应传入几个函数来调用。所以我们需要将其修改一下。  
```js
function compose(mids){
    return (...args) => {
        let ret = mids[0](...args);
        for(let i=1;i<mids.length;i++){
            ret = mids[i](ret);
        }
        return ret;
    }
}
let com = compose([upperCaseStr, reverseStr, firsetCaseLower])
com('abcdefg')  //gFEDCBA
```

就这样最终版的组合函数我们就完成了。