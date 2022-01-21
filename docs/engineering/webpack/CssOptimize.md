---
title: CSS 优化
description: 'webpack的MiniCssExtractPlugin css-minimizer-webpack-plugin'
---
# CSS 优化
以下都是基于 webpack5

## CSS分割
在传统开发中我们一般会把 script 的引入放在最后面，让游览器先运行加载 CSS 和 HTML，优先把页面显示出来，能给用户很好的体验。而在 webpack 则是默认把 css 打包进 js 里面，导致 css 和 js 同时加载。

### 使用 MiniCssExtractPlugin
webpack 提供了 MiniCssExtractPlugin 插件来讲 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。  

首先需要安装该插件
```
npm install --save-dev mini-css-extract-plugin
```

webpack.config.js中的配置
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
};
```
需要注意的是当使用 MiniCssExtractPlugin 时，就不需要 style-loade 了，因为 MiniCssExtractPlugin 把它代替了。  

之后打包，你就能看到所有 CSS 都会被提出来单独一个 CSS 文件

## Css压缩

### CssMinimizerPlugin
该插件按照 cssnano 规则去修改你的 CSS 并且压缩 CSS 代码。  

什么是 [cssnano](https://cssnano.co/) ?  

首先需要安装该插件
```
npm install css-minimizer-webpack-plugin --save-dev
```
然后在 webpack.config.js 中的配置  
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    loaders: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};
```
这个配置只能在 prodution 模式下才能使用，如果你想在开发环境中使用这需要这样
```js
module.exports = {
  optimization: {
    // [...]
    minimize: true,
  },
};
```

如果想了解两者更多相关配置，建议去 webpack 官网 或 Github 上详细观看。