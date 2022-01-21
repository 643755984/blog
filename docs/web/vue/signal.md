---
title: 组件通信
description: 'vue组件通信'
---

# 组件通信

## vue提供的通信

### props / $emit
这个大家应该都很熟悉的了，父组件通过props的方式向子组件传递数据，而通过$emit 子组件可以向父组件通信。 

所以这里不做更多的介绍。  

### provide / reject
这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。  

假设有两个组件： A.vue 和 B.vue，B和C 是 A 的子组件。
```js
// A.vue
export default {
  provide: {
    name: 'Aresn'
  }
}

// B.vue
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // Aresn
  }
}

// C.vue
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // Aresn
  }
}
```
可以看到只要在父组件中使用 provide 注入属性，那么他的所有后代组件都能接受到。  

不过要注意的是该方法传的值并不是响应式的。

:::tip
vue 在文档中提示 provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。
:::

### $children / $parent 
通过本身实例来的 $children 或 $parent 属性来获取父组件或子组件的实例。   
子组件（部分代码省略）：  
```js
// component-a
export default {
  data () {
    return {
      messageA: 'this is child'
    }
  }
}
```
父组件（部分代码省略）：
```html
<template>
  <com-a></com-a>
</template>

<script>
  export default {
    mounted() {
      console.log(this.$children[0].messageA) // this is child
    }
  }
</script>
```
缺点：只能父子组件，多级嵌套的话就会变得非常麻烦。

### ref 
通过 ref 来获取组件的实例，与上面的  $children / $parent 类似，都是通过操作实例来获取其它组件的信息。  
子组件（部分代码省略）：  
```js
// component-a
export default {
  data () {
    return {
      title: 'Vue.js'
    }
  },
  methods: {
    sayHello () {
      window.alert('Hello');
    }
  }
}
```
父组件（部分代码省略）：  
```html
<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.title);  // Vue.js
      comA.sayHello();  // 弹窗
    }
  }
</script>
```

### $attrs/$listeners
* $attrs: 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有用。  

* $listeners: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用。 

看起来是不是好像很复杂的样子？  

简单来说：$attrs与$listeners 是两个对象，$attrs 里存放的是父组件中绑定的非 Props 属性，$listeners里存放的是父组件中绑定的非原生事件。  

子组件（部分代码省略）：
```js
export default {
  props: {
    a: String
  },
  mounted() {
    console.log('attrs---->', this.$attrs)  // {b: 'b', c: 'c'}
    console.log('listeners---->', this.$listeners) // {dianji: f()}
  }
}
```

父组件（部分代码省略）：
```html
<template>
  <div class="home">
    <HelloWorld
    :a="'a'"
    :b="'b'"
    :c="'c'"
    @dianji="handleClick"></HelloWorld>
  </div>
</template>
<script>
export default {
  components: {
    HelloWorld
  },
  methods: {
    handleClick() {
      console.log('emit')
    }
  }
}
</script>
```


## 其它方式实现的通信

### vuex
使用 vuex 来保存数据，那么无论在任何地方都能获取到。  

具体使用方法，请看 vuex 文档

### localStorage / sessionStorage
利用游览器保存将数据保存，那么无论在任何地方都能获取到。  

具体使用方法，这里不再做介绍

