"use strict"

let methods = require('./methods')

let filterNull = require('./filterNull')

/**
 * 递归验证器
 * @param {*} data 验证数据
 * @param {*} options 验证表达式选项
 * @param {*} key 数据索引
 * @param {*} input 原始输入数据
 */
function recursion(data, options, key, input) {

   // 选项为构造函数或字符串（字符串表示自定义数据类型）
   if (methods[options]) {

      if (data === undefined || data === '') {
         return { data }
      }

      let { err, data: subData } = methods[options].type({ data })
      if (err) {
         return {
            error: `${key}值${err}`
         }
      }
      return {
         data: subData
      }

   }

   // 选项为对象
   else if (options instanceof Object) {

      // 选项为验证器表达式（type作为内部保留关键字，不能作为外部参数名，否则会产生冲突）
      if (options.type) {

         let field = options.name || key

         // 前置空值拦截
         if (data === undefined || data === '') {

            // 默认
            if (options.default) {
               data = options.default
            }

            // 直接赋值
            else if (options.value) {
               data = options.value
            }

            // 允许为空
            else if (options.allowNull === false) {
               return {
                  error: `${field}不能为空`
               }
            }

            else {
               return {
                  data: undefined
               }
            }

         }

         // type为内置构造函数或字符串（字符串用于表示自定义数据类型）
         if (methods[options.type]) {

            let funObj = methods[options.type]
            for (let name in options) {
               let fun = funObj[name]
               if (fun) {
                  let { err, data: subData } = fun({ data, option: options[name], input })
                  if (err) {
                     return {
                        error: `${field}${err}`
                     }
                  }
                  data = subData
               }
            }

            return { data }

         }

         // type为对象或数组，用于为父对象添加表达式
         else if (typeof options.type === 'object') {
            let { error, data: subData } = recursion(data, options.type, key, input)
            if (error) {
               if (Array.isArray(data)) {
                  return {
                     error: `${error}`
                  }
               } else {
                  return {
                     error: `参数${field}下${error}`
                  }
               }
            }
            return {
               data: subData
            }
         }

         // 未知参数
         else {
            return {
               error: `验证器中${field}字段参数配置错误，不支持type值为${options.type}`
            }
         }

      }

      // 选项为数组表达式
      else if (options instanceof Array) {

         if (data === undefined) {
            return {
               data: undefined
            }
         }

         if (!Array.isArray(data)) {
            return {
               error: `${key}值必须为数组`
            }
         }

         let dataArray = []

         let itemKey = 0
         let itemOptions = options[0]
         for (let itemData of data) {

            let { error, data: subData } = recursion(itemData, itemOptions, itemKey++, input)

            if (error) {
               return {
                  error: `${key}数组中key:${error}`
               }
            } else {
               // 空数组提示
               if (itemOptions.allowNull === false) {
                  if (subData === undefined || subData === '') {
                     return {
                        error: `${key}数组中key:${itemKey}值不能为空`
                     }
                  }
               }
               dataArray.push(subData)
            }
         }

         return {
            data: dataArray
         }

      }

      // 选项为对象表达式
      else {

         if (data === undefined) {
            return {
               data: undefined
            }
         }

         if (typeof data !== 'object') {
            return {
               error: `${key}值必须为对象`
            }
         }

         let dataObj = {}

         // 通配符验证表达式（针对具有相同数据结构和类型的可复用表达式）
         if (options.$) {
            for (let subKey in data) {
               let itemData = data[subKey]
               let { error, data: subData } = recursion(itemData, options.$, subKey, input)
               if (error) {
                  return {
                     error: `${key}对象中参数${error}`
                  }
               } else {
                  dataObj[subKey] = subData
               }
            }
         }

         // 子集递归验证
         else {

            for (let subKey in options) {
               let itemData = data[subKey]
               let itemOptions = options[subKey]
               let { error, data: subData } = recursion(itemData, itemOptions, subKey, input)
               if (error) {
                  if (key) {
                     return {
                        error: `${key}对象中${error}`
                     }
                  } else {
                     return {
                        error: error
                     }
                  }
               } else {
                  dataObj[subKey] = subData
               }
            }
         }

         return {
            data: dataObj
         }

      }

   }

}


// 自定义扩展
// Validator.middleware = []
// Validator.use = function (fn) {
//    this.middleware.push(fn)
// }

// Validator.use(() => {
//    console.log(111)
// })


/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} handler 导出数据自定义处理方法
 */
module.exports = (data, options, handler = {}) => {

   // 递归验证
   let output = recursion(data, options, '', data)

   if (output.error) {
      return output
   }

   // 对象空值过滤
   filterNull(output.data)

   // 数据构造器
   for (let name in handler) {
      let options = handler[name]
      // 使用自定义构造函数处理
      if (typeof options === 'function') {
         let outData = options.call(output.data)
         // 对象空值过滤
         output[name] = filterNull(outData)
      }
   }

   return output

}