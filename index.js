"use strict"

let filterNull = require('filter-null')

let methods = require('./methods')

class Parser {

   constructor(data, options) {
      this.data = data
      this.options = options
      return this.recursion(data, options, '')
   }

   /**
    * 递归验证器
    * @param {*} data 验证数据
    * @param {*} options 验证表达式选项
    * @param {*} key 数据索引
    */
   recursion(data, options, key) {

      // 选项为对象
      if (typeof options === 'object') {

         // 选项为验证器表达式（type作为内部保留关键字，应避免使用同名的type属性，否则会产生命名冲突）
         if (options.type) {

            let field = options.name || key

            // 空值拦截
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
                     let { error, data: subData } = fun({ data, option: options[name], input: this.data })
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

               if (data === undefined || data === '') {
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
                     if (subData === undefined || subData === '') {
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

         if (data === undefined || data === '') {
            return { data }
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

   // 数据构函数
   for (let name in handler) {
      let item = handler[name]
      // 使用自定义构造函数处理
      if (typeof item === 'function') {
         output.data[name] = item.call(output.data, output.data)
      }
   }

   // 对象空值过滤
   filterNull(output.data)

   return output

}

// 自定义扩展方法
Validator.use = function (type, options) {
   methods[type] = options
}

// 通过将静态的options放入函数作用域，使options持久化驻留在内存
// 避免同一个对象被重复的创建和销毁，实现options跨接口复用，提升性能的同时，也增加了代码复用率
Validator.schema = function (name, options, handler) {
   Validator[name] = function (data) {
      return Validator(data, options, handler)
   }
   return Validator[name]
}

module.exports = Validator
