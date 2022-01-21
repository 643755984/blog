---
title: new Vue时Data做了什么
---
# new Vue时Data做了什么

## 两个细节问题

### 为什么在mounted函数中能用this直接获取到data的值

```js
var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  mounted(){
    console.log(this.message) // Hello Vue!
  },
  methods: {
  }
});
```
### Data里面的数据命名跟methods命名不能有相同的情况

```js
var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  }, 
  methods: {
	message() {
      console.log('aa')
    }
  }
});
//> Script error.
//> [Vue warn]: Method "message" has already been defined as a data property.
```
## new VUE解析

依然是这个例子：

```js
var app = new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  mounted(){
    console.log(this.message) // Hello Vue!
  },
  methods: {
  }
});
```
### 构造函数

vue/src/core/instance/index.js
```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
通过Vue源码我们可以发现，new Vue的时候Vue只做了一个判断和执行一个初始化函数_init

### _init函数

进一步查看初始化函数
vue/src/core/instance/init.js
```js
// 只截取相关的一部分

vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
```
_init函数调用initState来初始化Data数据

### initState

vue/src/core/instance/state.js
```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) { // 判断data是否存在
    initData(vm)  //继续调用initData
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

initState继续调用initData

### initData

vue/src/core/instance/state.js
```js
function initData (vm: Component) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {}
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  // proxy data on instance
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // observe data
  observe(data, true /* asRootData */)
}
```

从initData我们可以得知在这里Vue对Data里的Key和methods、props的值进行了比较
如果存在相同就警告，这就是为什么开头会出现警告的原因。

但是仅仅从这里还没看得出上面问题核心问题，而这两个问题关键则是再proxy函数里面


### proxy

vue/src/core/instance/state.js
```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

在这一步看到defineProperty才恍然大悟，原来是通过Object.defineProperty的方法把key定义到
vm上面了。