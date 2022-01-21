---
title: nrm 安装与配置
description: 'nrm 安装与配置 nrm'
---

# nrm 安装与配置

## nrm的使用

nrm是npm的镜像源管理工具，有时候国外资源下载太慢，就可以使用nrm来切换镜像来快速下载。

##  安装

全局安装
```js
npm install -g nrm
```

## 常用指令

### nrm ls
使用可以查看所有可选的镜像。
```js
nrm ls                                                                                                              

* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/

```
*号代表当前正使用的镜像

### nrm use
nrm use +  镜像名 可以切换到你需要用的镜像
```js
nrm use taobao                                                                                                      

Registry has been set to: https://registry.npm.taobao.org/  // 切换成功
```

### nrm add 

nrm add + 镜像名 + 镜像路径 可以添加自定义镜像

适合添加公司内部镜像，下载私有资源。
```js
nrm add taobao2 https://registry.npm.taobao.org/
```

### nrm del

nrm del + 镜像名 可以删除已存在的镜像
```js
nrm del taobao2
```

### nrm test

nrm test + 镜像名 可以测速
```js
nrm test taobao

* taobao - 150ms
```