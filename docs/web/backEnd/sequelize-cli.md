---
title: 数据库管理 sequelize-cli
description: '数据库管理 sequelize-cli'
---

# 数据库管理 sequelize-cli

## 为什么需要数据库管理
如果只是平时简单的对一个库的表进行简易的设计和添加数据等操作的话。其实我们仅仅使用 Navicat 这个可视化软件就足够了。  

但是如果我们要是想更加团队化和专业化的话，就可以借助 sequelize-cli 来帮我们管理数据库的变更。使用 sequelize-cli 可以带来几个明显的好处。  
1. 能记录数据库的每次更改
2. 在不同的环境（开发、测试、CI）中切花
3. 回档之前的版本

## 使用 sequelize-cli

### 安装

```
npm i sequelize-cli --save-dev
```
这里需要注意的是  sequelize-cli 依赖 sequelize，而 sequelize 依赖 mysql2 来连接数据库，所以我们还需要安装这两个额外依赖。  

```
npm i sequelize
```
```
npm i mysql2
```

### 