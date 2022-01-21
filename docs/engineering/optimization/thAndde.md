---
title: 防抖与节流
description: '防抖与节流'
---
# 防抖与节流
在 JS 中有一些事件可能会被频繁的触发，例如：scroll、mousemove 等。这些事件很容易在 1 秒内被处罚几十甚至上百次。这对 JS 的性能会造成非常不好的影响，甚至如果你的事件存在样式修改，那么会造成明显的卡顿的感觉。  
为了避免这种情况出现，实现让这些事件能在保持一定的频率下执行，于是出现了 防抖(debounce) 和 节流(throttle) 两个方案。  

## 防抖 debounce
防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行。  

代码实现：  
```js
function debounce(func, wait) {
  let timeOut;
  return function () {
    let context = this;
    let args = arguments;

    if(timeOut) clearTimeout(timeOut);

    timeOut = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}
```
其原理是通过闭包来保存 timeOut（即计时器），每次都用函数时都判断 timeOut 有没有值，有就清理掉，然后重新赋值计时器。这样就能达到每次都重新计算的效果。  

但有时候为了能让用户有更好的体验，想让事件放在第一时间执行，而不是等到最后。  

修改版：
```js
function debounce(func, wait, immediate) {
  let timeOut;
  return function () {
    let context = this;
    let args = arguments;

    if(timeOut) clearTimeout(timeOut);

    if(immediate) {
      let callNow = !timeOut;

      timeOut = setTimeout(() => {
        timeOut = null;
      }, wait);

      if(callNow) func.apply(context, args);
    }else {
      timeOut = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    }
  }
}
```
添加了 immediate 来设定是使用立即执行模式，然后在新增 callNoww 变量来达到判断定时器是否有值，有就说明依然在防抖中。  

## 节流 throttle
防抖的核心思想是：就是指连续触发事件但是在 n 秒中只执行一次函数。只认第一次。  

实现代码（时间戳版本）：
```js
function throttle(fn, interval) {
  // last为上一次触发回调的时间
  let last = 0;
  
  return function () {
      let context = this;
      let args = arguments;
      let now = +new Date();
      
      // 判断上次触发的时间和本次触发的时间差是大于还是小于时间间隔的阈值
      if (now - last >= interval) {
          last = now;
          fn.apply(context, args);
      }
    }
}
```

也可以使用定时器版本：  
```js
function throttle(func, wait) {
  let timeout;
  return function() {
      let context = this;
      let args = arguments;
      // 如果定时器依然有，那么说明时间间隔还存在
      if (!timeout) {
          timeout = setTimeout(() => {
              timeout = null;
              func.apply(context, args)
          }, wait)
      }
  }
}
```

## 防抖加节流合并版
在防抖中，有使用如果用户一直不停的操作，那么就会导致不断的重新赋值 timeOut，并且用户也不会得到反馈。所以为了解决这个问题，把节流添加进防抖。如果用户在不断操作期间达到时间间隔要求，那么使用节流来规定其必须执行一次。从而达到良好的用户体验。  

```js
function throttle(fn, delay) {
  let last = 0, timer = null
  
  return function () { 
    let context = this
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()
    
    // 判断上次触发的时间和本次触发的时间差是大于还是小于时间间隔的阈值
    if (now - last < delay) {
    // 如果小于，那么按照防抖方式走，重新赋值定时器
       clearTimeout(timer)
       timer = setTimeout(function () {
          last = now
          fn.apply(context, args)
        }, delay)
    } else {
        // 如果大于，那么按照节流方式，立即执行一次
        last = now
        fn.apply(context, args)
    }
  }
}
```
这个合并版，由于有较好的用户体验，所以使用的更加广泛。


