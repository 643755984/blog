---
title: babel工具包(api)
description: 'babel工具包(api) '
---
# babel工具包(api)
前面我们已经了解 babel 基本运行过程后，那么如果我们想使用 babel 该如何使用呢？

这一节我们将来了解 babel 是提供哪些 api 来让我们进行操作的。

## @babel/parser
该 api 对应这 parse 阶段。主要功能是把源码转成 AST 

### 基本了解
@babel/parser 提供了有两个 api：parse 和 parseExpression。两者都是把源码转成 AST，不过 parse 返回的 AST 根节点是 File（整个 AST），parseExpression 返回的 AST 根节点是是 Expression（表达式的 AST）。两种之间区别在于粒度不同。

```js
babelParser.parse(code, [options])
babelParser.parseExpression(code, [options])
```

### opitons常用配置
* plugins： 指定jsx、typescript、flow 等插件来解析对应的语法
* sourceType： 指定是否支持解析模块语法，有 module、script、unambiguous 3个取值，module 是解析 es module 语法，script 则不解析 es module 语法，当作脚本执行，unambiguous 则是根据内容是否有 import 和 export 来确定是否解析 es module 语法。

其它配置请自行查看官网进行了解 [@babel/parser](https://babeljs.io/docs/en/babel-parser#options)

## @babel/traverse 、 @babel/template 和 @babel/types
该 api 对应 transform 阶段。主要功能是对 AST 进行增删查改。

### @babel/traverse
```js
traverse(parent, opts)
```
常用的就前面两个参数，parent 指定要遍历的 AST 节点，opts 指定 visitor 函数。babel 会在遍历 parent 对应的 AST 时调用相应的 visitor 函数。  

visitor 的值可以是函数或对象：
* 如果是函数，那么就相当于是 enter 时调用的函数。
* 如果是对象，则可以明确指定 enter 或者 exit 时的处理函数。

事例代码：
```js
// 进入 FunctionDeclaration 节点时调用
traverse(ast, {
  FunctionDeclaration: {
      enter(path, state) {}
  }
})

// 默认是进入节点时调用，和上面等价
traverse(ast, {
  FunctionDeclaration(path, state) {}
})

// 进入 FunctionDeclaration 和 VariableDeclaration 节点时调用
traverse(ast, {
  'FunctionDeclaration|VariableDeclaration'(path, state) {}
})

// 通过别名指定离开各种 Declaration 节点时调用
traverse(ast, {
  Declaration: {
      exit(path, state) {}
  }
})
```
具体的别名可以去[babel-types 的类型定义](https://github.com/babel/babel/blob/main/packages/babel-types/src/ast-types/generated/index.ts#L2489-L2535) 查看

### @babel/types
遍历 AST 的过程中需要创建一些 AST 和判断 AST 的类型，这时候就需要 @babel/types 包。  
举例来说，如果要创建IfStatement就可以调用
```js
t.ifStatement(test, consequent, alternate);
```
而判断节点是否是 IfStatement 就可以调用 isIfStatement 或者 assertIfStatement
```js
t.isIfStatement(node, opts);
t.assertIfStatement(node, opts);
```
isXxx 会返回 boolean 表示结果，而 assertXxx 则会在类型不一致时抛异常。

### @babel/template
通过 @babel/types 创建 AST 还是比较麻烦的，要一个个的创建然后组装，如果 AST 节点比较多的话需要写很多代码，这时候就可以使用 @babel/template 包来批量创建。

## @babel/generate
该 api 对应 generate 阶段。主要功能是把 AST 打印为目标代码字符串

```js
function (ast: Object, opts: Object, code: string): {code, map} 
```
第一个参数是要打印的 AST

第二个参数是 options，指定打印的一些细节，比如通过 comments 指定是否包含注释，通过 minified 指定是否包含空白字符

第三个参数当多个文件合并打印的时候需要用到

options 中常用的是 sourceMaps，开启了这个选项才会生成 sourcemap

```js
const { code, map } = generate(ast, { sourceMaps: true })
```
## @babel/code-frame
额外功能。主要是处理中途产生的错误
```js
const result = codeFrameColumns(rawLines, location, {
  /* options */
});
```
## @babel/core
额外功能。前面的包是完成某一部分的功能的，而 @babel/core 包则是基于它们完成整个编译流程，从源码到目标代码，生成 sourcemap。
```js
transformSync(code, options); // => { code, map, ast }
transformFileSync(filename, options); // => { code, map, ast }
transformFromAstSync(
  parsedAst,
  sourceCode,
  options
); // => { code, map, ast }
```
前三个 transformXxx 的 api 分别是从源代码、源代码文件、源代码 AST 这开始处理，最终生成目标代码和 sourcemap。

options 主要配置 plugins 和 presets，指定具体要做什么转换。

这些 api 也同样提供了异步的版本，异步地进行编译，返回一个 promise
```js
transformAsync("code();", options).then(result => {})
transformFileAsync("filename.js", options).then(result => {})
transformFromAstAsync(parsedAst, sourceCode, options).then(result => {})
```

@babel/core 包还有一个 createConfigItem 的 api，用于 plugin 和 preset 的封装。