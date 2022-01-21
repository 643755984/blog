---
title: JS的继承
---

# JS的继承
很多面向对象语言都支持两种继承，接口继承和实现继承，前者只继承方法签名，后者继承实际的方法。
接口继承在 ECMAScript 中是不可能的，因为函数没有签名，所以 ECMAScript 只能实现实现继承。

## 构造函数继承
基本思路很简单，在子类构造函数中调用父类构造函数，并且使用 call 来修改父类的this指向问题。

```js
function Person(name = '李四'){
    this.name = name;
}

function Children(name, age){
    Person.call(this, name);
    this.age = age;
}
var children = new Children('子类', 18);
console.log(children.name) // 子类
console.log(children.age)   //18
```

从这里我们知道构造函数是可以很好的实现对象属性的继承，如果我们想继承方法得这样写：

```js
function Person(name = '李四'){
    this.name = name;
    this.sayName = function(){
        console.log(this.name)
    }
}
    function Children(name, age){
    Person.call(this, name);
    this.age = age;
}
var children = new Children('子类', 18);
console.log(children.name) // 子类
console.log(children.sayName()) // 子类
console.log(children.age)  //18
```

初步一看，好像也没问题，该实现的功能都实现了。其实不然，如果我们
仔细看一看，每次实例一个对象都会创建一个新的对象的属性，那么我们这个 sayName 这个方法也是属性，
会不会也是每次都新建了呢？接下来我们把代码修改看一看

```js
function Person(name = '李四'){
    this.name = name;
    this.sayName = function(){
        console.log(this.name)
    }
}
    function Children(name, age){
    Person.call(this, name);
    this.age = age;
}
function Children(name, age){
    Person.call(this, name);
    this.age = age;
}
var children = new Children('子类', 18);
var children2 = new Children('子类', 18);
console.log(children.sayName == children2.sayName); // false
```
从这里我们可以看出，sayName 每次都是被新建的。而实际的需求我们根本不需要新建，
我们要的是每个实例对象都共用一个方法。

最后我们总结一下构造函数继承：  
优点:  
* 能很好的实现属性继承，子父类属性互不影响，子类构造函数能向父类构造函数传参
* 可以继承多个构造函数(call 多个)  

缺点：  
* 无法实现函数复用，浪费内存  

## 原型链继承
顾名思义，原型链继承就是利用原型与原型链来实现继承。如果还不懂什么是原型和原型链，那么最好先去
补充这方面的知识在来观看。

```js
function Person(){};
Person.prototype.name = '张三'

function Children(){};
Children.prototype = new Person();
Children.prototype.sayName = function() {
    console.log(this.name);
}


let children = new Children();
let children2 = new Children();
console.log(children.sayName == children2.sayName); //true
console.log(children.name) // 张三
```
通过修改 Children 的原型，使其指向 Person 的实例。从而实现了方法与属性的共用。  

如果子类跟父类属性相同，那么子类会覆盖父类
```js
function Person(){};
Person.prototype.name = '张三'

function Children(){};
Children.prototype = new Person();

Children.prototype.name = '李四';

let children = new Children();

console.log(children.name)
```

但是在原型上共用属性会引来新的问题。

```js
function Person(){};
Person.prototype.name = '张三'

function Children(){};
Children.prototype = new Person();
Children.prototype.hobbies = [1, 2, 3]
Children.prototype.sayName = function() {
    console.log(this.name);
}
let children = new Children();
let children2 = new Children();

console.log(children.hobbies); // [1, 2, 3]
console.log(children2.hobbies); // [1, 2, 3]

children2.hobbies.push(4);

console.log(children.hobbies); // [1, 2, 3, 4]
console.log(children2.hobbies); // [1, 2, 3, 4]
```
可以看出原型上的属性做出修改，那么所有的实例对象的属性都做出了修改，无法像构造函数那样做到每个实例对象属性私有。

最后我们总结一下原型链继承：  
优点：  
* 能共享使用父类方法，节省内存  

缺点：  
* 继承单一，无法像构造函数实现多继承
* 所有实例共享属性、
* 子类是没办法在实例对象时给父类传递值


## 组合继承
通过构造函数的实例对象属性独立和原型链的方法共享相结合使用，从而产生组合继承。

```js
function Person(){
    this.name = name;
    this.sayName = function(){
        console.log(this.name)
    }
}
function Children(name, age){
    Person.call(this, name);
    this.age = age;
}
Children.prototype = new Person();
Children.prototype.constructor = Children; //把Children原型上的contructor重新指回Children

var children = new Children('子类', 18);
var children2 = new Children('子类', 18);
console.log(children.sayName == children2.sayName)  //false
console.log(children.name)  //子类
console.log(children.sayName()) //子类
console.log(children.age)   //18
```
分工明确，使用构造函数的继承方法来继承属性，而原型链则继承函数。从而达到实例对象属性私有和函数共用。

总结：  
优点：
* 实例属性私有，方法共用  

缺点：
* 调用了两次父类构造函数，生成了两份实例（call时调用一次，new Person时又一次）
* Person的那么属性会变到 Children 上（第一次是修改 Children 的时候，第二次是 call 时候）

## 寄生继承
PS：参考了《JS高级程序设计》

寄生式继承背后的思路类似于寄生构造函数和工厂模式：创建一个实现继承的函数，以某种方式
增强对象，然后返回这个对象。

```js
function createAnother(original){
    let clone = Object.create(original); // 这里根据你的需求来使用创建对象而不是Object.create()
    clone.sayHi = function() {
        console.log("hi");
    }
    return clone;
}
let person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
}
let obj = createAnother(person);
obj.sayHi(); // hi
```

优点：  
* 跟工厂函数一样，能批量给直到对象添加所需要的功能  

缺点：
* 通过寄生式继承给对象添加函数会导致函数难以重用，与构造函数模式类型。


## 寄生式组合继承
PS：参考了《JS高级程序设计》  

为了解决组合继承中的缺点，从而产生了寄生式组合继承。

```js
function inheritPrototype(subType, superType) {
    let prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function(){
    console.log(this.name);
}

function SubType(name, age){
    SuperType.call(this, name);　　
    this.age = age;
}

inheritPrototype(SubType, SuperType);
let children = new SubType("张三", 14);
children.sayName();  // 张三
console.log(children.age);  //14
```

1. 通过构造函数继承属性，原型链继承方法。
2. 与组合继承不同的是，这里只调用了一次 SuperType。
3. 原型继承时，SubType 不会继承 SuperType 的属性。
