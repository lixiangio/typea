"use strict";

/**
 * 空值过滤器（使用入口冗余代码，减少递归判断）
 * @param {*} data 数据源
 */
function filterNull(data) {
   if (data === undefined || data === "") {
      return
   }
   else if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
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
   else if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
         let copyArray = []
         for (let itemData of data) {
            if (itemData !== undefined && itemData !== "") {
               copyArray.push(itemData)
            }
         }
         parent[key] = copyArray
      } else {
         for (let key in data) {
            recursion(data[key], data, key)
         }
         if (!Object.keys(data).length) {
            delete parent[key]
         }
      }
   } else if (typeof data === 'function') {
      parent[key] = data()
      recursion(parent[key], parent, key)
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

// console.log(filterNull(['xxx@xx.xx', , , , , '7777']))

module.exports = filterNull