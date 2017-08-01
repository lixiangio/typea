"use strict";

let validator = require('validator')

// 自定义类型
let customize = {
   // mongoDB ID
   ObjectId(data, key) {
      if (!validator.isMongoId(data + '')) {
         return `${key}参数必须为ObjectId`
      }
   },
   // 手机号
   MobilePhone(data, key) {
      if (!validator.isMobilePhone(data + '', 'zh-CN')) {
         return `${key}参数必须为手机号`
      }
   }
}

/**
 * 递归验证器
 * @param {*} key 数据索引
 * @param {*} data 验证数据
 * @param {*} options 验证规则选项
 * @param {*} parent 当前父级对象
 * @param {*} input 原始输入数据
 * @param {*} output 处理输出数据
 */
function recursionVerify(key, data, options, parent, input, output) {

   // 选项为对象（引用型数据）
   if (typeof options === 'object') {

      // 选项为数组结构
      if (Array.isArray(options)) {

         if (!Array.isArray(data)) {
            return `${key}参数必须为数组`
         }

         // 非根对象时创建数组结构
         if (key) {
            parent[key] = []
            parent = parent[key]
         }

         for (let subKey in data) {
            let itemData = data[subKey]
            let itemOptions = options[0]
            let result = recursionVerify(subKey, itemData, itemOptions, parent, input, output)
            if (result) return `${key}数组Key:${result}`
         }

      }

      // 选项为对象
      else {

         // 选项为验证器（type作为保留关键字，禁止作为参数名使用，且只允许定义数据类型，不能定义数据结构）
         if (options.type) {

            // 空值处理
            if (data === undefined || data === '') {

               // 默认
               if (options.default) {
                  data = options.default
               }

               // 允许为空
               else if (!options.allowNull) {
                  return `${key}参数不能为空`
               }

            }

            // 包含
            else if (options.contain) {
               // 对Number类型特殊照顾，将字符串转数值
               if (options.type === Number) {
                  data = Number(data)
               }
               let result = options.contain.indexOf(data)
               if (result === -1) {
                  return `${key}参数超出可选范围，不包含${typeof data}：${data}`
               }
            }

            // type为JS内置数据类型
            else if (typeof options.type === 'function') {

               // 字符串类型
               if (options.type === String) {

                  if (!data) {
                     return `${key}参数不存在`
                  }
                  if (typeof data !== 'string') {
                     return `${key}参数必须为字符串`
                  }

                  // 长度验证
                  if (options.minLength) {
                     if (data.length < options.minLength) {
                        return `${key}参数长度不能小于${options.minLength}个字符`
                     }
                  }
                  if (options.maxLength) {
                     if (data.length > options.maxLength) {
                        return `${key}参数长度不能大于${options.maxLength}个字符`
                     }
                  }

                  // 包含字符串
                  if (options.contain) {
                     if (options.contain === Number) {
                        if (data.search(/\d+/) === -1) {
                           return `${key}参数必须包含数字`
                        }
                     }
                  }

                  // 不包含
                  if (options.noContain) {
                     if (options.noContain === Number) {
                        if (data.search(/\d+/) > -1) {
                           return `${key}参数不能包含数字`
                        }
                     }
                  }

                  // 正则表达式
                  if (options.reg) {
                     if (data.search(options.reg) === -1) {
                        return `${key}参数格式错误`
                     }
                  }

               }

               // 数值型
               else if (options.type === Number) {

                  data = Number(data)
                  if (isNaN(data)) {
                     return `${key}参数必须为数值或可转换为数值的字符串`
                  }

                  // 数值范围验证
                  if (options.min) {
                     if (data < options.min) {
                        return `${key}参数不能小于${options.min}`
                     }
                  }

                  if (options.max) {
                     if (data > options.max) {
                        return `${key}参数不能大于${options.max}`
                     }
                  }

                  // 数值转布尔值
                  if (options.conversion) {
                     if (options.conversion === Boolean) {
                        if (data) {
                           data = true
                        } else {
                           data = false
                        }
                     }
                  }

               }

               // 对象
               else if (options.type === Object) {
                  if (typeof data !== 'object') {
                     return `${key}参数必须为对象`
                  }
               }

               // 数组
               else if (options.type === Array) {

                  if (!Array.isArray(data)) {
                     return `${key}参数必须为数组`
                  }

               }

               // 日期
               else if (options.type === Date) {

                  if (!validator.toDate(data + '')) {
                     return `${key}参数必须为日期类型`
                  }

               }

               // 布尔
               else if (options.type === Boolean) {

                  if (typeof data !== 'boolean') {
                     return `${key}参数必须为布尔值`
                  }

               }

            }

            // type为字符串，表示自定义数据类型
            else if (typeof options.type === 'string') {

               if (customize[options.type]) {
                  let result = customize[options.type](data, key)
                  if (result) return result
               } else {
                  return `${options.type}自定义类型不存在`
               }

            }

            // type为对象，用于实现允许对象结构为空表达式
            else if (typeof options.type === 'object') {
               let result = recursionVerify(key, data, options.type, parent, input, output)
               if (result) {
                  if (Array.isArray(data)) {
                     return `${result}`
                  } else {
                     return `${key}下${result}`
                  }
               }
            }

            // 导出
            if (data !== undefined) {

               // 重命名
               if (options.rename) {
                  parent[options.rename] = data
               } else {
                  parent[key] = data
               }

            }

         }

         // 选项为对象结构
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
                  let result = recursionVerify(subKey, itemData, itemOptions, parent, input, output)
                  if (result) return result
               }
            }

            // 指定验证器
            else {
               for (let subKey in options) {
                  let itemData = data[subKey]
                  let itemOptions = options[subKey]
                  let result = recursionVerify(subKey, itemData, itemOptions, parent, input, output)
                  if (result) return result
               }
            }

         }
      }

   }

   // 选项为非对象（赋值型数据）
   else {

      // 选项为函数（JS内置数据类型）
      if (typeof options === 'function') {

         // 字符串类型
         if (options === String) {

            if (!data) {
               return `${key}参数不存在`
            }

            if (typeof data !== 'string') {
               return `${key}参数必须为字符串`
            }

            if (data === '') {
               return `${key}参数不能为空`
            }

         }

         // 数值型
         else if (options === Number) {

            data = Number(data)
            if (isNaN(data)) {
               return `${key}参数必须为数值或可转换为数值的字符串`
            }

         }

         // 对象
         else if (options === Object) {

            if (typeof data !== 'object') {
               return `${key}参数必须为对象`
            }

         }

         // 数组
         else if (options === Array) {

            if (!Array.isArray(data)) {
               return `${key}参数必须为数组`
            }

         }

         // 日期
         else if (options === Date) {

            if (!validator.toDate(data + '')) {
               return `${key}参数必须为日期类型`
            }

         }

         // 布尔
         else if (options === Boolean) {

            if (typeof data !== 'boolean') {
               return `${key}参数必须为布尔值`
            }

         }

         // 自定义构造方法
         else {

            // 空值过滤
            let result = options.call(input, output)
            if (typeof result === 'object') {
               let start = true
               for (let key in result) {
                  if (result[key]) {
                     start = false
                  } else {
                     delete result[key]
                  }
               }
               if (start) {
                  return
               }
            }

            data = result

         }

      }

      // 选项为字符串（自定义数据类型）
      else if (typeof options === 'string') {

         if (customize[options]) {
            return customize[options](data, key)
         } else {
            return `${options}自定义类型不存在`
         }

      }

      //将验证数据保存至父节点
      parent[key] = data
   }

}


// 通过Path获取数据
function pathGetData(data, path) {
   let pathArray = path.split('.')
   for (let key of pathArray) {
      if (data[key] === undefined) {
         return undefined
      } else {
         data = data[key]
      }
   }
   return data
}


/**
 * 验证器
 * @param {*} data 验证数据
 * @param {*} options 验证数据表达式
 */
function Verify(data, options, handler = {}) {

   // 数据导出容器
   let output = {
      error: null,//错误信息
      data: {},//验证结果
      query: {},//查询条件（预定义）
      filter: {},//过滤条件（预定义）
      insert: {},//插入数据（预定义）
      update: {},//更新数据（预定义）
      options: {},//选项（预定义）
   }

   // 递归验证
   let result = recursionVerify(null, data, options, output.data, data, output)

   if (result) {
      output.error = result
      return output
   }

   // 分组导出参数至指定对象
   if (handler.group) {
      let data = output.data
      for (let name in handler.group) {
         // 对象不存在时自动创建
         if (!output[name]) {
            output[name] = {}
         }
         let groupArray = handler.group[name]
         for (let path of groupArray) {
            if (data[path] !== undefined) {
               output[name][path] = data[path]
            }
         }
      }
   }

   // 参数依赖
   if (handler.depend) {
      let data = output.data
      for (let name in handler.depend) {
         let dependArray = handler.depend[name]
         for (let key of dependArray) {
            if (data[key] === undefined) {
               output.error = `${name}与${key}参数必须同时存在`
               return output
            }
         }
      }
   }

   // 按指定路径迁移数据
   if (handler.path) {
      for (let name in handler.path) {
         let data = output.data[name]
         let path = handler.path[name].split('.')
         let target = output.data
         // for (let key of path) {
         //    if (key === "$") {

         //    } else {
         //       if (target[key]) {
         //          target = target[key]
         //       } else {
         //          target = undefined
         //          break
         //       }
         //    }
         // }
         // target = data
      }
   }

   // 自定义方法
   if (handler.methods) {
      for (let path in handler.methods) {
         let data = pathGetData(output.data, path)
         if (data !== undefined) {
            handler.methods[path].call(output, data)
         }
      }
   }

   return output

}

// 自定义扩展中间件
// Verify.middleware = []
// Verify.use = function (fn) {
//    this.middleware.push(fn)
// }

module.exports = Verify