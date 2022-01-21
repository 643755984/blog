---
title: this
description: 'JS的this的指向'
---

# JS的this指向

## 隐示绑定

### 指向调用它的对象

```js
function fn1(){
  console.log(this) // window
}
fn1() // 相当于 window.fn1()

(function() {
  console.log(this) // window
})()

function getSum(){
  var aa = function() {
    console.log(this) // window
  }
  aa()
}
getSum() // 这里指向getSum，但是getSum里面的this是window，所以aa里面的this也是window

var objList = {
  name: 'aaa',
  getSum: function() {
      console.log(this) 
  }
}
objList.getSum() // objList

```
在给DOM绑定事件中this指向绑定事件的元素

```js
var button = document.getElementsByTagName('button');

button.addEventListener('click', function(ev){
  console.log(this === ev.currentTarget) // true
}

```
ev.currentTarget是绑定事件的元素，而ev.target是当前触发事件的元素。

::: tip
但在IE中使用attachEvent，里面的this默认指向window。
:::

### 构造函数this指向new的对象

```js

function People(name, age) {
  this.name = name;
  this.age = age;
}

var man = new People('zhangsan', 15)
```

### 定时器的this指向window

```js
setTimeout(function(){
  console.log(this) // window
}, 1000)
```

### ES6新增的箭头函数

箭头函数是词法作用域，这意味着其this绑定到了附近scope的上下文，使其能保存this的指向

```js
var people = {
  name: 'zhangsan',
  age: 15,
  say: function() {
    return () => {
      return {
        name: `my name is ${this.name}, ${this.age}`
      }
    }
  }
}
let people1 = people.say();
console.log(people1().name) // my name is zhangsan, 15
```

## 显示绑定

### call、bind和apply修改this指向

```js
function fn(){
  console.log(this.name)
}

var objList = {
     name: 'aaa',
     getSum: function() {
          console.log(this.name)
     }
}

fn.call(objList)  // aaa
var fn2 = fn.bind(objList)
fn2() // aaa
```
call 会立即执行一次函数，传参是一个值一个值的传。  
apply 会立即执行一次函数，传参是传一个数组，数组里面包含所有的值。  
bind 不会立即执行函数，拥有返回值，返回值是函数。传参是一个值一个值的传。

