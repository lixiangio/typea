"use strict";

let validator = require('validator')

let type = require('./type')

let Options = require('./options')

let Handler = require('./handler')

let filterNull = require('./filterNull')


/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {*} handler 验证结果处理
 */
function Verify(data, options, handler = {}) {

   // 数据导出容器
   let output = {
      error: null,//错误信息
      data: {},//验证结果
   }

   // 递归验证
   let error = recursionVerify(data, options, output.data, null, data, output)

   if (error) {
      output.error = error
      return output
   }

   // 空值过滤
   output.data = filterNull(output.data)

   // 验证结果处理函数
   for (let name in handler) {
      let fun = Handler[name]
      let options = handler[name]
      // 使用处理函数处理
      if (fun) {
         fun(output, options)
      }
      // 使用自定义构造函数处理
      else if (typeof options === 'function') {
         let outData = options.call(output.data)
         output[name] = filterNull(outData)
      }
   }

   return output

}


/**
 * 递归验证器
 * @param {*} data 验证数据
 * @param {*} options 验证规则选项
 * @param {*} parent 当前父级对象
 * @param {*} key 数据索引
 * @param {*} input 原始输入数据
 * @param {*} output 验证输出数据
 */
function recursionVerify(data, options, parent, key, input, output) {

   // 选项为对象
   if (typeof options === 'object') {

      // 选项为数组（数据结构）
      if (Array.isArray(options)) {

         if (!Array.isArray(data)) {
            return `${key}参数必须为数组`
         }

         // 非根对象时创建数组结构
         if (key) {
            parent[key] = []
            parent = parent[key]
         }

         let itemKey = 0
         let itemOptions = options[0]
         for (let itemData of data) {
            let error = recursionVerify(itemData, itemOptions, parent, itemKey++, input, output)
            if (error) {
               return `${key}数组Key:${error}`
            }
         }

         // 空数组提示
         if (itemOptions.allowNull === false && itemKey === 0) {
            return `${key}数组不能为空`
         }

      }

      // 选项为对象
      else {

         // 选项为验证表达式（type作为保留关键字，只允许定义数据类型，不能作为参数名使用）
         if (options.type) {

            // 空值处理
            if (data === undefined || data === '') {

               // 默认
               if (options.default) {
                  parent[key] = options.default
               }

               // 允许为空
               else if (options.allowNull === false) {
                  return `${key}参数不能为空`
               }

               else {
                  return
               }

            }

            // type为函数或字符串（字符串表示自定义数据类型）
            else if (Options[options.type]) {
               for (let name in options) {
                  let fun = Options[options.type][name]
                  if (fun) {
                     let result = fun(data, options[name])
                     if (result.err) {
                        return key + err
                     } else {
                        parent[key] = result.data
                     }
                  }
               }
            }

            // type为对象或数组，用于为对象结构添加表达式
            else if (typeof options.type === 'object') {
               let error = recursionVerify(data, options.type, parent, key, input, output)
               if (error) {
                  if (Array.isArray(data)) {
                     return `${error}`
                  } else {
                     return `${key}下${error}`
                  }
               }
            }

            // 自定义构建方法
            if (options.method) {
               parent[key] = options.method.call(output, data)
            }

         }

         // 选项为对象（数据结构）
         else {

            if (typeof data !== 'object') {
               return `${key}参数必须为对象`
            }

            // 非根对象时创建对象结构
            if (key) {
               parent[key] = {}
               parent = parent[key]
            }

            // 泛验证器（具有相同数据类型的可复用验证器）
            if (options.$) {
               for (let subKey in data) {
                  let itemData = data[subKey]
                  let itemOptions = options.$
                  let error = recursionVerify(itemData, itemOptions, parent, subKey, input, output)
                  if (error) return error
               }
            }

            // 子集递归验证
            else {
               for (let subKey in options) {
                  let itemData = data[subKey]
                  let itemOptions = options[subKey]
                  let error = recursionVerify(itemData, itemOptions, parent, subKey, input, output)
                  if (error) return error
               }
            }

         }
      }

   }

   // 选项为函数或字符串
   else if (type[options]) {
      let result = type[options](data)
      if (result.err) {
         return key + result.err
      } else {
         parent[key] = result.data
      }
   }

   // 选项为自定义构造器
   else if (typeof options === 'function') {
      parent[key] = options.call(output.data, output)
   }

}


// /**
//  * 通过Path获取数据
//  * @param {*} data 数据源
//  * @param {String} path 数据路径
//  */
// function pathGetData(data, path) {
//    let pathArray = path.split('.')
//    for (let key of pathArray) {
//       if (data[key] === undefined) {
//          return undefined
//       } else {
//          data = data[key]
//       }
//    }
//    return data
// }


// 扩展自定义验证中间件
// Verify.middleware = []
// Verify.use = function (fn) {
//    this.middleware.push(fn)
// }

module.exports = Verify