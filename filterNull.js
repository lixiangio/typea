"use strict";

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
   else if (typeof data === 'object') {
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
            let itemData = data[key]
            recursion(itemData, data, key)
         }
      }
   }
}


/**
 * 空值过滤
 * @param {*} data 数据源
 */
function filterNull(data) {
   if (data === undefined || data === "") {
      return
   }
   else if (typeof data === 'object') {
      if (Array.isArray(data)) {
         let copyArray = []
         for (let itemData of data) {
            if (itemData !== undefined && itemData !== "") {
               copyArray.push(itemData)
            }
         }
      } else {
         for (let key in data) {
            let itemData = data[key]
            recursion(itemData, data, key)
         }
      }
   }
   return data
}

let data = {
   a: 1,
   b: {
      b1: 666,
      b2: undefined
   },
   c: [1, 2, , 3]
}

console.log(filterNull(data))

module.exports = filterNull