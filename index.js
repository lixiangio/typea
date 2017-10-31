"use strict"

let filterNull = require('filter-null')

let { methods, extend } = require('./methods')

class validator {

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

            // 不支持的参数
            else {
               return {
                  error: `${field}参数配置错误，不支持${options.type}类型`
               }
            }

         }

         // 选项为数组表达式
         else if (Array.isArray(options)) {

            let [itemOptions] = options
            if (Array.isArray(data)) {
               if (itemOptions.allowNull === false) {
                  if (data.length === 0) {
                     return {
                        error: `数组${key}值不能为空`
                     }
                  }
               }
            } else {
               if (itemOptions.allowNull === false) {
                  if (data === undefined){
                     return {
                        error: `数组${key}值不能为空`
                     }
                  } else {
                     return {
                        error: `${key}必须为数组类型`
                     }
                  }
               } else {
                  return {
                     data: undefined
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

   }

}

/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} handler 导出数据自定义处理方法
 */
function Validator(data, options, handler = {}) {

   let output = new validator(data, options, '')

   if (output.error) {
      return output
   }

   // 对象空值过滤
   filterNull(output.data)

   // 数据构函数
   for (let name in handler) {
      let options = handler[name]
      // 使用自定义构造函数处理
      if (typeof options === 'function') {
         let outData = options.call(output.data, output.data)
         // 对象空值过滤
         output[name] = filterNull(outData)
      }
   }

   return output

}

// 验证类型扩展
Validator.use = extend

module.exports = Validator