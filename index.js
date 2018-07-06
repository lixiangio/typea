"use strict"

let filterNull = require('filter-null')

let methods = require('./methods')

class Parser {

   constructor(origin, options) {
      this.origin = origin
      this.options = options
      return this.recursion(origin, options, '')
   }

   /**
    * 判断是否允许为空值，默认将undefined、 null、空字符串视为空值
    * 默认值在大多数场景下适用，在出现例外时，可以在指定字段上使用ignore属性，重置对默认空值的定义
    * @param {*} data 需要校验空值的数据
    */
   isNull(data, ignore = [undefined, null, '']) {

      if (ignore.indexOf(data) > -1) {
         return true
      }

   }

   /**
    * 递归验证器
    * @param {*} data 待验证数据
    * @param {*} options 验证表达式
    * @param {String,Number} key 数据索引
    */
   recursion(data, options, key) {

      // 选项为对象
      if (typeof options === 'object') {

         // 选项为验证表达式
         if (options.type) {

            let field = options.name || key

            // 前置空值拦截
            if (this.isNull(data, options.ignore)) {

               // 默认
               if (options.default) {
                  data = options.default
               }

               // 直接赋值
               else if (options.value) {
                  data = options.value
               }

               // 允许空值
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
                     let { error, data: subData } = fun({ data, option: options[name], origin: this.origin })
                     if (error) {
                        return {
                           error: `${field}${error}`
                        }
                     }
                     data = subData
                  }
               }

               return { data }

            }

            // 不支持的参数
            else {
               return {
                  error: `${field}参数配置错误，不支持${options.type}类型`
               }
            }

         }

         // 选项为数组表达式
         else if (Array.isArray(options)) {

            let [itemOptions, allowNull] = options

            if (Array.isArray(data)) {
               if (itemOptions.allowNull === false) {
                  if (data.length === 0) {
                     return {
                        error: `数组${key}值不能为空`
                     }
                  }
               }
            } else {

               if (this.isNull(data)) {
                  if (allowNull === false) {
                     return {
                        error: `${key}数组不能为空`
                     }
                  } else {
                     return {
                        data: undefined
                     }
                  }
               } else {
                  return {
                     error: `${key}必须为数组类型`
                  }
               }

            }

            let dataArray = []
            let itemKey = 0

            for (let itemData of data) {

               let { error, data: subData } = this.recursion(itemData, itemOptions, itemKey++)

               if (error) {
                  return {
                     error: `数组${key}中key:${error}`
                  }
               } else {
                  // 空数组提示
                  if (itemOptions.allowNull === false) {
                     if (this.isNull(subData)) {
                        return {
                           error: `数组${key}中key:${itemKey}值不能为空`
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
               return { data: undefined }
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
                        error: `对象${key}中${error}`
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

      // 选项为构造函数或字符串（字符串表示自定义数据类型）
      else if (methods[options]) {

         if (this.isNull(data)) {
            return { data: undefined }
         }

         let { error, data: subData } = methods[options].type({ data })

         if (error) {
            return { error: `${key}值${error}` }
         } else {
            return { data: subData }
         }

      }

   }

}

/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} handler 导出数据自定义处理方法
 */
function Validator(data, options, handler = {}) {

   let output = new Parser(data, options)

   if (output.error) {
      return output
   }

   // 数据扩展函数，基于已验证的数据构建新的数据结构
   for (let name in handler) {
      let item = handler[name]
      // 使用自定义构造函数处理
      if (typeof item === 'function') {
         item = item.call(output.data, output.data)
      }
      output.data[name] = item
   }

   // 对象空值过滤
   filterNull(output.data)

   return output

}

// 自定义数据类型扩展方法
Validator.use = function (type, options) {

   methods[type] = options

}

// 通过预处理方式，将提前处理好的静态options持久化驻留在内存中
// 避免同一个对象被多次重复的创建和销毁，实现options跨接口复用，在节省资源的同时，也增加了代码复用率
Validator.schema = function (name, options, handler) {

   Validator[name] = function (data) {
      return Validator(data, options, handler)
   }

   return Validator[name]

}

module.exports = Validator
