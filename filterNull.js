"use strict";

/**
 * 空值过滤器（使用入口冗余代码，减少递归判断）
 * @param {*} data 数据源
 */
function filterNull(data) {
   if (data instanceof Object) {
      if (data instanceof Array) {
         let copyArray = []
         for (let itemData of data) {
            if (itemData !== undefined && itemData !== "") {
               copyArray.push(itemData)
            }
         }
         return copyArray
      } else {
         for (let key in data) {
            let itemData = data[key]
            recursion(itemData, data, key)
         }
      }
   } else if (data === "") {
      data === undefined
   }
   return data
}

/**
 * 递归器
 * @param {*} data 
 * @param {*} parent 
 * @param {*} key 
 */
function recursion(data, parent, key) {
   if (data === undefined || data === "") {
      delete parent[key]
   }
   else if (Object.prototype.toString.call(data) === '[object Object]') {
      for (let key in data) {
         recursion(data[key], data, key)
      }
      if (!Object.keys(data).length) {
         delete parent[key]
      }
   }
   else if (data instanceof Array) {
      let copyArray = []
      for (let itemData of data) {
         if (itemData !== undefined && itemData !== "") {
            copyArray.push(itemData)
         }
      }
      parent[key] = copyArray
   }
   else if (data instanceof Function) {
      parent[key] = data()
      recursion(parent[key], parent, key)
   }
   else {
      parent[key] = data
   }
}

// let data = {
//    a: 1,
//    b: {
//       b1: 666,
//       b2: undefined
//    },
//    c: [1, 2, , 3]
// }

// console.log(filterNull({
//    arr: ['xxx@xx.xx', , 0, , , '7777'],
//    xxx() {
//       return 888
//    }
// }))

module.exports = filterNull