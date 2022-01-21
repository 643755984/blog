---
title: 分治法
description: '分治法'
---

# 分治法

## 基本思想
分治法的基本思想是将一个规模为 n 的问题分解为 k 个规模较小的问题，这些子问题互相独立且与原问题相同。从解决子问题开始，到最后将各个子问题的解合并得到原问题的解。  

## 使用条件
* 该问题的规模缩小到一定的程度就可以容易的解决
* 该问题可以分解为若干规模小的相同问题，即该问题具有最优子结构的性质
* 利用该问题分解出的子问题的解可以合并为该问题的解
* 该问题所分解出的各个子问题是相互独立的，即子问题之间不包含公共的子问题

## 代码实现

### 二分查找
二分查找的思想就是从中间开始，把待查找的元素分为两部分。然后在继续上一步，把分出来的两部分再次在中间切开继续分出两部分。直到找到需要找的元素或只剩一个不能再次划分为止。
```js
function binSearch(arr, value) {
  let low = 0, high = arr.length - 1, mid
  while(low <= high>) {
    mid = (low + high) / 2
    if(value == arr[mid])
      return mid + 1
    if(value < arr[mid])
      high = mid - 1
    else 
      low = mid + 1
  }
  return 0
}
```

### 快速排序
快速排序的基本思想是在待排序的n个元素中任取一个元素（通常取第一个元素）作为基准，把该元素放入适当位置后，数据序列被次元素划分成两部分。然后递归再重复处理划开的两部分，直到每部分化成一个元素时。

```js
function partition(arr, s, t) {
  let i = s, j = t
  let temp = arr[i]  // 以arr[i]为基准
  while(i < j) {
    while(j > i && arr[j] >= temp) j--
    arr[i] = arr[j]
    while(i < j && arr[i] <= temp) i++
    arr[j] = arr[i]
  }
  arr[i] = temp
  return i
}

function quickSort(arr, s, t) {
  let i
  if(s < t) {  //区间内至少存在两个元素
    i = partition(arr, s, t)
    quickSort(arr, s, i-1)  // 对左区间递归排序
    quickSort(arr, i+1, t)  // 对右区间递归排序
  }
  return arr
}
```

<!-- ### 合并排序 -->

