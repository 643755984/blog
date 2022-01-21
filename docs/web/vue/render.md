---
title: 渲染函数
---

## createElments函数

Vue2.0版本后，新添加了vdom以及render函数等特性，template模板并不会直接生成真是的dom，而是
先编译为render函数，然后再由render函数生成虚拟DOM。因此Vue除了使用传统模板了构建UI外，新增
render函数来构建UI。

由于少了一道编译过程，所以使用render函数会加快Vue的编译速度。

::: tip
Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。
:::

但是Vue官网却不是提倡所有情况都使用render函数。

让我们深入一个官网简单的例子，这个例子里 render 函数很实用。假设我们要生成一些带锚点的标题：
```js
<script type="text/x-template" id="anchored-heading-template">
  <h1 v-if="level === 1">
    <slot></slot>
  </h1>
  <h2 v-else-if="level === 2">
    <slot></slot>
  </h2>
  <h3 v-else-if="level === 3">
    <slot></slot>
  </h3>
  <h4 v-else-if="level === 4">
    <slot></slot>
  </h4>
  <h5 v-else-if="level === 5">
    <slot></slot>
  </h5>
  <h6 v-else-if="level === 6">
    <slot></slot>
  </h6>
</script>
```

```js
Vue.component('anchored-heading', {
  template: '#anchored-heading-template',
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

这里用模板并不是最好的选择：不但代码冗长，而且在每一个级别的标题中重复书写了 <slot></slot>，在要插入锚点元素时还要再次重复。

虽然模板在大多数组件中都非常好用，但是显然在这里它就不合适了。那么，我们来尝试使用 render 函数重写上面的例子：

```js
Vue.component('anchored-heading', {
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.$slots.default // 子节点数组
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

这样看起来简单多了！代码又很精简。createElment返回的正是虚拟节点(VNode)。

不过我并不打算详解createELments，有兴趣的小伙伴可自行去官网查看。

## 拥抱JSX
Vue本身并没有提供开箱即用的jsx 支持，但其提供了babel 插件，让我们也能像 React 一样（90%相似）使用 jsx 来 构建 UI。

所以我们需要实现安装好一些Babel插件

```js
npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
```

再到babel.config.js 下添加配置
```js
{
  "presets": ["@vue/babel-preset-jsx"]
}
```

这样我们就能再Vue中使用jsx啦

```js
export default {
    name: 'renderCom',
    render: function(h) {
        return (
            <div>Hello</div>
        );
    }
}
```

引入组件使用
```js
<template>
  <div class="home">
    <RenderCom></RenderCom>
  </div>
</template>

<script>
import RenderCom from '@/components/renderCom.vue'

export default {
  name: 'Home',
  components: {
    RenderCom
  }
}
</script>
```
完美显示，那render函数能使用组件吗？

HelloWorld是一个template格式书写的组件
```js
import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'renderCom',
    data(){
        return {
            styleObj: {
                width: '100px',
                height: '100px'
            }
        }
    },
    methods:{
        clickHandler(){
            this.count++;
        }
    },
    render: function(h) {
        return (
            <HelloWorld></HelloWorld>
        );
    }
}
```
HelloWorld组件显示出来，说明render不仅能使用render组件，还能使用template组件

### 操作style

```js
export default {
    name: 'renderCom',
    render: function(h) {
        return (
            <div style={{width: '100px', height: '100px'}}>
                {this.count}
            </div>
        );
    }
}
```

使用data数据
```js
export default {
    name: 'renderCom',
    data(){
        return {
            color: 'red'
        }
    },
    render: function(h) {
        return (
            <div style={{width: '100px', height: '100px', backgroundColor: this.color}}>
                {this.count}
            </div>
        );
    }
}

```

使用对象
```js
export default {
    name: 'renderCom',
    // props: ['count'],
    data(){
        return {
            styleObj: {
                width: '100px',
                height: '100px'
            }
        }
    },
    methods:{
        clickHandler(){
            this.count++;
        }
    },
    render: function(h) {
        return (
            <div {...{attrs: this.styleObj}}>{this.count}</div>
        );
    }
}
```
不过这样赋值属性格式<div width='100px'>是这样

### 触发事件

JSX格式有三种：

1. 使用on-[eventName]格式，比如on-click
2. 使用on[eventName]格式，比如onClick
3. 使用 spread 语法，即 {...{on: {event: handlerFunction}}}

```js
export default {
    name: 'renderCom',
    data(){
        return {
            count: 1
        }
    },
    methods:{
        clickHandler(){
            this.count++;
        }
    },
    render: function(h) {
        return (
            <div onClick={this.clickHandler}>{this.count}</div>
        );
    }
}
```


```js
export default {
    name: 'renderCom',
    data(){
        return {
            count: 1
        }
    },
    methods:{
        clickHandler(){
            this.count++;
        }
    },
    render: function(h) {
        return (
            <div 
            {...{
                on: {
                    'click': this.clickHandler
                }
            }}>{this.count}</div>
        );
    }
}
```
但我们Vue JSX还提供了一种跟Vue相似的用法

### 指令

v-model
```js
<input vModel={this.newTodoText} />
```

v-mdoel加修饰符
```js
<input vModel_trim={this.newTodoText} />
```

v-on
```js
<input vOn:click={this.newTodoText} />
```

v-on加修饰符
```js
<input vOn:click_stop_prevent={this.newTodoText} />
```

v-html
```js
<p domPropsInnerHTML={html} />
```

### slots
named slots:
```js
render: function(h) {
  return (
    <MyComponent>
      <header slot="header">header</header>
      <footer slot="footer">footer</footer>
    </MyComponent>
  )
}
```

scoped slots:
```js
render() {
  const scopedSlots = {
    header: () => <header>header</header>,
    footer: () => <footer>footer</footer>
  }

  return <MyComponent scopedSlots={scopedSlots} />
}
```

## 函数式组件

如果你的组件不需要响应数据，生命周期，只是用props来显示组件，那么可以使用函数式组件。

在temoplate中使用
```js
<template functional>
    <div>函数式组件{{props.count}}</div>
</template>
<script>
export default {
    props: {
        count: {
            type: Number
        }
    }
}
</script>
```

在JSX中使用
```js
<script>
export default ({props}) => <div>Hello World<p>{props.count}</p></div>
</script>
```