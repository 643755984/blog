---
title: 贪心算法
description: '贪心算法'
---

# 贪心算法

## 基本思想
贪心算法并不从整体最优上加以考虑，所做的选择只是某种意义上的局部最优选择。所以贪心算法并不保证的到最优解，但是在某些问题上贪心算法的解就是最优解。  

### 贪心选择
在使用贪心算法之前，必须设立一套贪心选择的规则。使贪心算法在选择时候能有根据的选择局部上的最优。  
例如桌子上有5张大小不用的人民币，而你只能拿三张，怎么拿？你肯定会先拿大的，再到小的。这其实就是贪心选择，给人民划分了从大到小的排序，然后从大的拿起。  

## 实战

### 背包问题
现有3中物品和一背包，背包的容量为50斤。物品1重量是10斤，价值为60元；物品2重量是20斤，价格为100元；物品3重量是30斤，价值为120元。问应如何选择装入背包的物品，使得装入背包中物品的总价值最大？（与0-1背包问题类型，但是可以选取物品的一部分）

```js
let goods = [
  {weight: 10, value: 60},
  {weight: 30, value: 120},
  {weight: 20, value: 100}
]

let bag = {
  weight: 0,
  value: 0
};
const MAXWEIGHT = 50

function greedySelect() {
  for(let i=0;i<goods.length;i++) {
    if(bag.weight + goods[i].weight < MAXWEIGHT) {
      bag.value = bag.value + goods[i].value
      bag.weight = bag.weight + goods[i].weight
    }else {
      let tmp = MAXWEIGHT - bag.weight
      bag.value = bag.value + goods[i].value / goods[i].weight * tmp
      bag.weight = bag.weight + tmp
      return
    }
  }
}
// 贪心选择，根据每一斤物品价值大小进行从大到小的排序
goods = goods.sort(function(x, y) {
  return -(x.value / x.weight - y.value / y.weight)
})
greedySelect()
```