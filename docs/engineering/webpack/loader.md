---
title: Loader
description: 'webpack的loader是什么 webpack的loader有什么用 webpack学习'
---
# loader
loader 用于对模块的源代码进行转换。

## 概念
webpack 默认只能理解 JavaScript 和 JSON 文件。但是在前端当中还会有 css jpg 等各种文件，而这些文件 webpack 是没办法处理的。这时就需要用到 loader 来扩展 webpack 对于其它文件识别和处理的能力。

## 解析图片
图片的解析我们可以用到两个loader来实现，分别是 file-loader url-loader  
这里只演示 file-loader，如果你有兴趣你可去官网查看自己实现一个url-loader  

1. 创建一个 webpack 项目，目录如下  
![webpack](../../assets/webpack/03_01.png)

并且在index.js引入图片
```js
import img from './head.gif'
```

2. 安装 file-loader （npm install file-loader）

3. 在 webpack.config.js 下配置file-loader
```js
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
      rules: [
        { test: /\.(png|jpe?g|gif)$/i, use: 'file-loader' },
      ]
  }
};
```
在rules里写上你的配置  
test：匹配文件的后缀  
use：匹配对了然后使用哪个loader来解析  

4. 运行打包指令  
![webpack](../../assets/webpack/03_02.png)  

这时我就可以在dist文件夹下看到我们打包出来的图片了  

当然如果我们不想修改图片名称的话，可以这样在file-loader上添加配置
```js
module: {
    rules: [
    { 
        test: /\.(png|jpe?g|gif)$/i, 
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ],
        
    },
    ]
}
```
## 解析CSS
解析CSS需要用到两个 loader，一个是 css-loader，另一个是 style-loader，两个Loader分别
负责不同职责，如下：  
css-loader：会对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样。  
style-loader：把 CSS 插入到 DOM 中

1. 创建一个webpack项目
2. 下载好 css-loader style-loader 并且配置好webpack
```js
const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
      rules: [
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        },
      ]
  }
};
```
3. 在根目录下创建一个 css 文件
```css
body {
    background: #000;
}
```
4. 在index.js引入
```js
import css from './index.css'
```
5. 运行打包，然后找个html导入打包后的 css我们就可以看到效果了

::: tip
当遇到多个 loader 的时候，webpack 默认是从后面的 loader 开始执行。这里也就是先执行 css-loader 再到 style-loader
:::
