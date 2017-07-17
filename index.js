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

global.Verify = function (data, options) {

   // 数据导出容器
   let exportData = {
      error: null,//错误信息
      data: {},//验证容器
      group: {},//分组容器
   }

   // 递归验证
   let result = recursionVerify(null, data, options, exportData.data, exportData.group)

   if (result) {
      exportData.error = result
   }

   return exportData
}

/**
 * 递归验证器
 * @param {*} key 数据索引
 * @param {*} data 验证数据
 * @param {*} options 验证规则选项
 * @param {*} clone 克隆容器
 * @param {*} group 分组容器
 */
function recursionVerify(key, data, options, clone, group) {

   // 选项为对象（引用型数据）
   if (typeof options === 'object') {

      // 选项为数组结构
      if (Array.isArray(options)) {

         if (!Array.isArray(data)) {
            return `${key}参数必须为数组`
         }

         // 非根级时创建数组结构
         if (key) {
            clone[key] = []
            clone = clone[key]
         }

         for (let subKey in data) {
            let itemData = data[subKey]
            let itemOptions = options[0]
            let result = recursionVerify(subKey, itemData, itemOptions, clone, group)
            if (result) return `${key}数组Key:${result}`
         }

      }

      // 选项为对象
      else {

         // 选项为验证器（type作为保留关键字，禁止作为参数名使用，且只允许定义数据类型，不能定义数据结构）
         if (options.type) {

            // 空值处理
            if (data === undefined) {

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
               let result = options.contain.indexOf(data)
               if (result === -1) {
                  return `${key}参数超出可选范围，不包含${typeof data}类型${data}`
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
                  if (data === '') {
                     return `${key}参数不能为空`
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
                     return `${key}参数格式错误，必须为日期类型`
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

            // type为对象（只能定义数据类型）
            else if (typeof options.type === 'object') {
               return `验证器配置错误，type参数只能定义数据类型，不允许定义为数据结构`
            }

            // 分组数据（不管data是否为空，只要定义了分组就创建对应的分组对象）
            if (options.group) {
               if (!group[options.group]) {
                  group[options.group] = {}
               }
            }

            // 导出
            if (data !== undefined && data !== null) {

               // 验证数据
               clone[key] = data

               // 分组数据
               if (options.group) {
                  group[options.group][key] = data
               }

            }

         }

         // 选项为对象结构
         else {

            if (typeof data !== 'object') {
               return `${key}参数必须为对象`
            }

            // 非根级时创建对象结构
            if (key) {
               clone[key] = {}
               clone = clone[key]
            }

            // 泛验证器（具有相同数据类型的可复用验证器）
            if (options.$) {
               for (let subKey in data) {
                  let itemData = data[subKey]
                  let itemOptions = options.$
                  let result = recursionVerify(subKey, itemData, itemOptions, clone, group)
                  if (result) return result
               }
            }

            // 指定验证器
            else {
               for (let subKey in options) {
                  let itemData = data[subKey]
                  let itemOptions = options[subKey]
                  let result = recursionVerify(subKey, itemData, itemOptions, clone, group)
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
         if (options === Number) {

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
               return `${key}参数格式错误，必须为日期类型`
            }

         }

         // 布尔
         else if (options === Boolean) {

            if (typeof data !== 'boolean') {
               return `${key}参数必须为布尔值`
            }

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

      //导出验证数据
      clone[key] = data
   }
}

module.exports = Verify