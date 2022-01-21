---
title: jQuery的extend的实现
description: 'JQ的extend的实现 JQ的extend的原理'
---

## extend基本用法

作用：合并两个或者更多的对象的内容到第一个对象中。

让我们看看 extend 的用法：

```js
jQuery.extend( target [, object1 ] [, objectN ] )
```

第一个参数 target，表示要拓展的目标，我们就称它为目标对象吧。

后面的参数，都传入对象，内容都会复制到目标对象中，我们就称它们为待复制对象吧。

举个例子：
```js
var obj1 = {
    a: 1,
    b: { b1: 1, b2: 2 }
};

var obj2 = {
    b: { b1: 3, b3: 4 },
    c: 3
};

var obj3 = {
    d: 4
}

console.log($.extend(obj1, obj2, obj3));

// {
//    a: 1,
//    b: { b1: 3, b3: 4 },
//    c: 3,
//    d: 4
// }
```
当两个对象出现相同字段的时候，后者会覆盖前者，而不会进行深层次的覆盖。

## extend第一版
```js
// 第一版
function extend() {
    var name, options, copy;
    var length = arguments.length;
    var i = 1;
    var target = arguments[0];

    for (; i < length; i++) {
        options = arguments[i];
        if (options != null) {
            for (name in options) {
                copy = options[name];
                if (copy !== undefined){
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};
```

## extend深拷贝
那如何进行深层次的复制呢？jQuery v1.1.4 加入了一个新的用法：
```js
jQuery.extend( [deep], target, object1 [, objectN ] )
```
也就是说，函数的第一个参数可以传一个布尔值，如果为 true，我们就会进行深拷贝，false 依然当做浅拷贝，这个时候，target 就往后移动到第二个参数。

还是举这个例子：
```js
var obj1 = {
    a: 1,
    b: { b1: 1, b2: 2 }
};

var obj2 = {
    b: { b1: 3, b3: 4 },
    c: 3
};

var obj3 = {
    d: 4
}

console.log($.extend(true, obj1, obj2, obj3));

// {
//    a: 1,
//    b: { b1: 3, b2: 2, b3: 4 },
//    c: 3,
//    d: 4
// }
```

## extend第二版
```js
// 第二版
function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是才是target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为{}
    if (typeof target !== 'object') {
        target = {}
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免extend(a,,b)这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                if (deep && copy && typeof copy == 'object') {
                    // 递归调用
                    target[name] = extend(deep, src, copy);
                }
                else if (copy !== undefined){
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};
```
在实现上，核心的部分还是跟上篇实现的深浅拷贝函数一致，如果要复制的对象的属性值是一个对象，就递归调用 extend。不过 extend 的实现中，多了很多细节上的判断，比如第一个参数是否是布尔值，target 是否是一个对象，不传参数时的默认值等。

## 类型不一致
其实我们实现的方法有个小 bug ，不信我们写个 demo:
```js
var obj1 = {
    a: 1,
    b: {
        c: 2
    }
}

var obj2 = {
    b: {
        c: [5],

    }
}

var d = extend(true, obj1, obj2)
console.log(d);
// {
//     a: 1,
//     b: {
//         c: {
//             0: 5
//         }
//     }
// }
```

## 修改版
```js
function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是才是target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为{}
    if (typeof target !== 'object') {
        target = {}
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免extend(a,,b)这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                if (deep && copy && typeof copy == 'object') {
              
                    // 添加一个类型判断
                    copyIsArray = Array.isArray(copy)
                    if(copyIsArray){
                        src = src && Array.isArray(src) ? src : [];
                    }
                    
                    // 递归调用 
                    target[name] = extend(deep, src, copy);
                }
                else if (copy !== undefined){
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};
```