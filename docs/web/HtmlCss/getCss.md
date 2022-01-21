---
title: JS 获取DOM的CSS
description: 'JS 获取DOM的CSS getComputedStyle'
---

# 使用JS获取DOM的CSS两种方式

## Style
使用 style 获取和设置样式都一样，只能从DOM上的style设置和获取  
```html
<div class="box" style="position: relative"></div>
```
获取样式
```js
let box = document.getElementsByClassName('box')[0]
console.log(box.style.width)  //返回空的字符串
console.log(box.style.position)   // 'relative'
```

## getComputedStyle
获取所有元素计算之后的 css 属性，包括默认的。该方法只读，也就是不能像 style 那样可以赋值。
```html
<div class="box" style="position: relative"></div>

<style>
.box {
  width: 100px;
  height: 100px;
}
</style>
```
使用 getComputedStyle 获取样式
```js
let box = document.getElementsByClassName('box')[0]
console.log(window.getComputedStyle(box, null)['width'])  // 100px
```
第二个参数为伪类，也就是说明我们还能查询伪类的样式  
```html
<div class="box" style="position: relative"></div>

<style>
.box::after {
  content: '';
  width: 80px;
  height: 80px;
}
</style>
```
```js
let box = document.getElementsByClassName('box')[0]
console.log(window.getComputedStyle(box, 'after')['width'])  // 80px
```
真是厉害，不过 getComputedStyle 也有缺点  
1. IE 不兼容，在 IE 上得使用 el.currentSytle[attribute]
2. 会引起回流
