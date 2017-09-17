"use strict"

let Options = require('./options')

let filterNull = require('./filterNull')


/**
 * 验证器
 * @param {*} data 数据源
 * @param {*} options 验证表达式
 * @param {Object} handler 导出数据自定义处理方法
 * @param {Function} callback 附加回调函数（用于全局参数注入）
 */
function Validator(data, options, handler = {}, callback) {

   // 递归验证
   let output = recursion(data, options, '', data)

   if (output.error) {
      return output
   }

   // data对象空值过滤
   output.data = filterNull(output.data)

   // 数据构造器
   for (let name in handler) {
      let options = handler[name]
      // 使用自定义构造函数处理
      if (typeof options === 'function') {
         let outData = options.call(output.data)
         output[name] = filterNull(outData)
      }
   }

   // 附加回调函数
   if (callback) {
      callback(output.data)
   }

   return output

}

/**
 * 递归验证器
 * @param {*} data 验证数据
 * @param {*} options 验证表达式选项
 * @param {*} key 数据索引
 * @param {*} input 原始输入数据
 */
function recursion(data, options, key, input) {

   // 选项为对象
   if (typeof options === 'object') {

      // 选项为数组
      if (Array.isArray(options)) {

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

      // 选项为对象
      else {

         // 选项为验证表达式（type作为保留关键字，只允许定义数据类型，不能作为参数名使用）
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

            // type为构造函数或字符串（字符串用于表示自定义数据类型）
            if (Options[options.type]) {

               let funObj = Options[options.type]
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

         else {

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

   // 选项为构造函数或字符串（字符串用于表示自定义数据类型）
   else if (Options[options]) {

      if (data === undefined || data === '') {
         return { data }
      }

      let { err, data: subData } = Options[options].type({ data })
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


// // 设置选项
// Validator.config = function ({ language }) {
//    if (language) {

//    } else {

//    }
// }

// // 自定义扩展
// Validator.middleware = []
// Validator.use = function (fn) {
//    this.middleware.push(fn)
// }

// Validator.use(() => {
//    console.log(111)
// })

// console.log(Validator.middleware)

module.exports = Validator