"use strict"

let methods = require('./methods')

let filterNull = require('./filterNull')

class Validator {

   constructor(data, options, key) {
      this.data = data
      this.options = options
      return this.recursion(data, options, key)
   }

   /**
    * 递归验证器
    * @param {*} data 验证数据
    * @param {*} options 验证表达式选项
    * @param {*} key 数据索引
    */
   recursion(data, options, key) {

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

         // 选项为验证器表达式（type作为内部保留关键字，应避免在外部使用type属性，否则会产生命名冲突）
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
                     let { err, data: subData } = fun({ data, option: options[name], input: this.data })
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
               let { error, data: subData } = this.recursion(data, options.type, key)
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

               let { error, data: subData } = this.recursion(itemData, itemOptions, itemKey++)

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

            for (let subKey in options) {
               let itemData = data[subKey]
               let itemOptions = options[subKey]
               let { error, data: subData } = this.recursion(itemData, itemOptions, subKey)
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

            return {
               data: dataObj
            }

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
   let output = new Validator(data, options, '')

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