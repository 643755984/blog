---
title: call、apply和bind的实现
description: 'JS的call、apply和bind的实现 JScall、apply和bind原理'
---

## call的模拟实现

call()方法在使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或方法。

fn.call(obj, data1, data2)

例子：
```js
var foo = {
  value: 1
};

functon bar(){
  console.log(this.value);
};

bar.call(foo); //1
```
注意两点：

1. call 改变了 this 的指向，指向到 foo
2. bar 函数执行了

### 模拟实现第一步
那么我们该怎么模拟实现这两个效果呢？

试想当调用 call 的时候，把 foo 对象改造成如下
```js
var foo = {
  value: 1,
  bar: function() {
    console.log(this.value);
  }
};

foo.bar(); //1
```

这个时候 this 就指向了 foo，是不是很简单呢？

但是这样却给 foo 对象本身添加了一个属性，这可不行呐！

不过也不用担心，我们用 delete 再删除它不就好了~

所以我们模拟的步骤可以分为：

1.将函数设为对象的属性

2.执行该函数

3.删除该函数

以上个例子为例，就是：
```js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```
n 是对象的属性名，反正最后也要删除它，所以起成什么都无所谓。

根据这个思路，我们可以尝试着去写第一版的 call2 函数：
```js
// 第一版
Function.prototype.call2 = function(context){
  // 首先获取调用call的函数，用this可以获取
  context.fn = this;
  context.fn();
  delete context.fn;
}

// 测试一下
var foo = {
  value: 1
};

function bar(){
  console.log(this.value);
}

bar.call2(foo); // 2
```
正好打印出来的是1

### 模拟实现第二步
call还可以传入指定的参数，我们还没实现这个

注意：传入的参数并不确定，这可咋办？

不急，我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：
```js
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

// 执行后 args为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```
不定长的参数问题解决了，我们接着要把第二版完成
```js
// 第二版修改版
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }
    context.fn(...args)
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value);
}

bar.call2(foo, 'kevin', 18);
// kevin
// 18
// 1
```

### 模拟实现第三步

还有两个小点要注意：

1. this 参数可以传 null，当为 null 的时候，视为指向 window

举个例子：
```js
var value = 1;

function bar() {
    console.log(this.value);
}

bar.call(null); // 1
bar.call(); // 1
```
虽然这个例子本身不使用 call，结果依然一样。

2. 函数是可以有返回值的！
```js
var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'kevin', 18));
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

不过都很好解决，让我们直接看第三版也就是最后一版的代码：

```js
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i]);
    }

    var result = context.fn(...args);

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```
到此，我们完成了 call 的模拟实现

## apply的模拟实现
apply 的实现跟 call 类似，在这里直接给代码，同样借助 ES6 来实现更方便一些
```js
// 第三版
Function.prototype.apply2 = function (context, arr = []) {
    var context = context || window;
    context.fn = this;

    var result = result = context.fn(...arr);

    delete context.fn
    return result;
}

var value = 1;

function bar(val1, val2) {
    console.log(val1+ '---'+val2);
}
bar.apply2(bar)
```

## bind的模拟实现

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。

由此我们可以首先得出 bind 函数的两个特点：

1.返回一个函数

2.可以传入参数

### 模拟实现第一步
从第一个特点开始，我们举个例子：
```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo); 

bindFoo(); // 1
```
关于指定 this 的指向，我们可以使用 call 或者 apply 实现
```js
// 第一版
Function.prototype.bind2 = function(context){
    var self = this;
    return function() {
        return self.apply(context);
    }
}
```
此外，之所以 return self.apply(context)，是考虑到绑定函数可能是有返回值。

### 模拟实现第二步

接下来看第二点，可以传入参数。这个就有点让人费解了，我在 bind 的时候，是否可以传参呢？我在执行 bind 返回的函数的时候，可不可以传参呢？让我们看个例子：
```js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```
函数需要传 name 和 age 两个参数，竟然还可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age!

这可咋办？不急，我们用 arguments 进行处理：
```js
// 第二版
Function.prototype.bind2 = function (context) {

    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }

}
```

### 模拟实现第三步
完成了这两点，最难的部分到啦！因为 bind 还有一个特点，就是

一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。举个例子：

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

注意：尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

所以我们可以通过修改返回的函数的原型来实现，让我们写一下：

```js
// 第三版
Function.prototype.bind2 = function(context){
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound;
}
```

### 优化版
但是在这个写法中，我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

```js
// 第四版
Function.prototype.bind2 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```
到此为止，大的问题都已经解决

### 几个小问题

#### 调用 bind 的不是函数咋办？
不行，我们要报错！
```js
if (typeof this !== "function") {
  throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
}
```
#### 我要在线上用
```js
Function.prototype.bind = Function.prototype.bind || function () {
    ……
};
```

### 最终代码
```js
Function.prototype.bind2 = function(context) {
    var self = this;
    if(typeof self !== "function"){
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var args = Array.prototype.slice.call(arguments, 1);

    var FNOP = function() {};
    
    var fBound = function() {
        var bindArgs = Array.prototype.slice.call(argements);
        return self.apply(this instanceof FBound ? this : contsext, args.concat(bindArgs));
    }
    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();
    return fBound;
}

```