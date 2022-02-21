---
title: 什么是Webpack
description: '什么是webpack webpack学习'
---

# 什么是Webpack

## 概念
webpack 的核心是用于现代 JavaScript 应用程序的静态模块打包器。 当 webpack 处理您的应用程序时，它会在内部构建一个依赖关系图，该图映射您项目所需的每个模块并生成一个或多个包。  

核心关键词：静态模块打包、构建依赖关系图和生成一个或多个包。

### 静态模块打包

#### 为什么要模块打包呢？  

#### 1. 浏览器不识别CommonJS等模块化规范
要知道node.js 生态中积累了大量的 JavaScript 写的代码，却因为 node.js 端遵循的 CommonJS 模块化规范与浏览器端格格不入，导致代码无法得到复用，这是一个巨大的损失。于是 webpack 要做的就是将这些模块打包成游览器识别的代码。  

#### 2. 引入顺序问题
在不适用webpack的情况下，我们引入JS文件是这样的
```js
// index.html
<script src="index.js"></script>
```
但是如果一个页面需要引入多个模块，那么就需要写成这样
```js
// index.html
<script src="index1.js"></script>
<script src="index2.js"></script>
<script src="index3.js"></script>
```
虽然这样引入初看还可以，但是事实却隐藏着一个问题，那就是如何保证依赖执行的顺序正确？  

如果 index1.js 使用到了 index2.js 的内容就会报错。这时因为JS执行时从上到下的，所以在执行 index1.js index2.js还没执行，里面的内容也还没有。

### 依赖关系图
那 webpack 如何知道你用了哪些包呢？这就需要用到依赖关系图。  
1. 首先 webpack 会从你配置的入口文件开始
2. 寻找当前文件锁依赖的模块
3. 查找 2 中超导的入口文件的依赖，进行遍历递归，重复 1 2 3 顺序执行
4. 直到查找完全部模块，生成依赖图

### 生成一个或多个包
如果一个项目的所有 JS 都放到一个 JS 文件里面，那么就是这样的
```js
// index.html
<script src="index.js"></script>
```
所有的 JS，可以想象这个 JS 文件有多大。这都性能优化来说是非常不好的。  

在 webpack 里我们可以根据需求对 JS 进行分类打包，变成多个 JS 文件


## 初识配置
创建一个新的 webpack 项目
1. 使用 npm init 初始化项目
2. 使用 Node 安装 webpack 和 webpack-cli
  
![webpack](../../assets/webpack/02_01.png)

index.js内容如下：
```js
console.log(123)
```
### Entry 入口
entry 属性的作用就是告诉 webpack 我们的项目文件入口位置在哪里

现在让我们在根目录在新建一个 webpack 配置文件
```js
module.exports = {
    entry: './index.js'
};
```
这里配置的是入口文件为 index.js(因为我们所有其它文件都在index.js里面引入使用，所以webpack就能根据这一个文件能查找到我们使用的所有文件，然后构建依赖图)

### Output 出口
output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。  

添加出口配置
```js
const path = require('path');
module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'my-first-webpack.bundle.js',
    },
};
```
出口文件也就是配置打包后的文件，path配置打包后放在那里的路径，
filename 是打包后的JS文件命名。  

为了方便打包，我们再在 package.josn 配置下的 scripts 添加一条打包指令
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
}
```

然后运行打包指令：npm run build  
这时webpack就会根据我们的配置去寻找入口文件index.js然后打包。

### chunk
在打包过程中，首先会进行模块合并。而模块合并成的文件就程之为 chunk。chunk合并成 chunk 组。那么如果通过以上来描述一个入口起点：在其内部，会创建一个只有一个 chunk 的 chunk 组。  
例如：
```js
module.exports = {
    entry: './index.js'
};
```
这会创建一个名为 main 的 chunk 组。此 chunk 组包含 ./index.js 模块。如果index.js里面有新引入的模块，那么新模块也会被添加到此 chunk 中。

记住chunk不是boudle，boudle是chunk输出之后的文件。  

chunk有两种形式：
* initial(初始化)：是入口起点的main chunk。此 chunk 包含入口起点指定的所有模块及其依赖项。
* non-initial 是可以延迟加载的块。可能会出现在使用 动态导入(dynamic imports)或者 SplitChunksPlugin 时。

### mode
配置 webpack 的模式，有三个值：  
* development 开发模式，会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development。为模块和 chunk 启用有效的名。
* production 生产模式，会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 production。为模块和 chunk 启用确定性的混淆名称
* none 不使用任何默认优化选项

如果没有设置，默认为 production。

::: tip
至于 loader 和 plugin 会在下面分开介绍并且简单的使用。
:::

