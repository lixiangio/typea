"use strict"

let filterNull = require('filter-null')

let Types = require('./type')
let symbols = require('./symbol')

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

      // 选项值为对象
      if (typeof options === 'object') {

         // 选项值为验证表达式
         if (options.type) {

            // 优先使用别名
            let field = options.name || key

            // 空值处理
            if (this.isNull(data, options.ignore)) {

               // 默认值
               if (options.default) {
                  data = options.default
               }

               // value赋值
               else if (options.value) {
                  data = options.value
               }

               // 禁止空值
               else if (options.allowNull === false) {
                  return {
                     error: `${field}不能为空`
                  }
               }

               else {
                  return {}
               }

            }

            // type为内置构造函数或字符串（字符串用于表示自定义数据类型）
            if (Types[options.type]) {

               let funObj = Types[options.type]
               for (let name in options) {
                  let fun = funObj[name]
                  if (fun) {
                     let option = options[name]
                     let { error, data: subData } = fun({ data, option, origin: this.origin })
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

         // 选项值为数组结构
         else if (Array.isArray(options)) {

            if (!Array.isArray(data)) {

               return {
                  error: `${key}必须为数组类型`
               }

            }

            let dataArray = []
            let itemKey = 0

            // options为单数时采用通用匹配
            if (options.length === 1) {

               let [option] = options

               for (let itemData of data) {

                  // 子集递归验证
                  let { error, data: subData } = this.recursion(itemData, option, itemKey)

                  if (error) {
                     return {
                        error: `[${itemKey}]${error}`
                     }
                  } else {
                     dataArray.push(subData)
                  }

                  itemKey++
               }
            }

            // options为复数时采用精确匹配
            else {

               for (let option of options) {

                  let itemData = data[itemKey]

                  // 子集递归验证
                  let { error, data: subData } = this.recursion(itemData, option, itemKey)

                  if (error) {
                     return {
                        error: `[${itemKey}]${error}`
                     }
                  } else {
                     dataArray.push(subData)
                  }

                  itemKey++

               }

            }

            return {
               data: dataArray
            }

         }

         // 选项值为对象结构
         else {

            if (typeof data !== 'object') {
               return {
                  error: `值必须为对象`
               }
            }

            let dataObj = {}

            for (let subKey in options) {

               let itemData = data[subKey]
               let itemOptions = options[subKey]
               let { error, data: subData } = this.recursion(itemData, itemOptions, subKey)

               if (error) {
                  // 非根节点
                  if (key) {
                     return {
                        error: `.${subKey}${error}`
                     }
                  } else {
                     return {
                        error: `${subKey}${error}`
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

      // 选项值为数据类型（值为构造函数或字符串，字符串表示自定义类型）
      else if (Types[options]) {

         if (this.isNull(data)) {
            return {}
         }

         let { error, data: subData } = Types[options].type({ data })

         if (error) {
            return { error: `值${error}` }
         } else {
            return { data: subData }
         }

      }

      // 选项值为严格匹配的精确值类型
      else if (data === options) {

         return { data }

      }

      // 精确值匹配失败
      else {

         return { error: `值必须为${options}` }

      }

   }

}

/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} handler 导出数据自定义处理方法
 */
function Check(data, options, handler = {}) {

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

Check.types = symbols

/**
 * 自定义数据类型扩展方法
 * @param {Function, Symbol, String} type 数据类型
 * @param {Object} options 扩展选项
 * @param {Object.Function} options 扩展方法
 */
Check.use = function (type, options = {}) {

   if (!type) return

   // 通过Function、Symbol定位，扩展已有数据类型
   if (Types[type]) {

      Object.assign(Types[type], options)

   }

   // 通过String定位，扩展已有数据类型或创建新类型
   else if (typeof type === 'string') {

      // 扩展已有Symbol类型
      if (symbols[type]) {
         let symbol = symbols[type]
         Object.assign(Types[symbol], options)
      }

      // 创建新类型
      else {
         let symbol = Symbol(type)
         symbols[type] = symbol
         Types[symbol] = options
      }

   }

}


/**
 * 通过预处理方式，将提前处理好的静态options持久化驻留在内存中
 * 避免同一个对象被多次重复的创建和销毁，实现options跨接口复用，在节省资源的同时，也增加了代码复用率
 * @param {String} name schema名称
 * @param {*} options 验证表达式
 * @param {Object} extend 数据扩展选项
 */
Check.schema = function (name, options, extend) {

   Check[name] = function (data) {
      return Check(data, options, extend)
   }

   /**
    * 严格模式，禁止空值
    */
   Check[name].strict = function () {

   }


   /**
    * 宽松模式，用于数据更新
    * 忽略所有allowNull值，有值验证，无值跳过，
    */
   Check[name].loose = function () {

   }

   return Check[name]

}

module.exports = Check