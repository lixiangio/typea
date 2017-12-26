"use strict"

let validator = require('validator')

// 公共方法
let commonMethod = {
   // 参数自定义转换方法
   method({ data, option: fun, input }) {
      return { data: fun.call(input, data) }
   },
   // 直接赋值（会覆盖原来的值）
   value({ option: value }) {
      return { data: value }
   },
   // 与
   and({ data, option, input }) {
      // 如果option为函数，应先执行函数，将函数转为数组
      if (option instanceof Function) {
         option = option.call(input, data)
      }
      if (option instanceof Array) {
         for (let name of option) {
            if (input[name] === undefined || input[name] === '') {
               return { error: `必须与${name}参数同时存在` }
            }
         }
      }
      return { data }
   },
   // 或
   or({ data, option, input }) {
      // 如果option为函数，应先执行函数，将函数转为数组
      if (option instanceof Function) {
         option = option.call(input, data)
      }
      if (option instanceof Array) {
         let status = true
         for (let name of option) {
            if (input[name] !== undefined && input[name] !== '') {
               status = false
            }
         }
         if (status) {
            return { error: `必须至少与[${option}]参数中的一个同时存在` }
         }
      }
      return { data }
   },
}

// 数据类型方法
let methods = {
   [String]: {
      // 数据类型验证
      type({ data }) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { error: '必须为字符串' }
         }
      },
      // 限制最小长度
      minLength({ data, option: minLength }) {
         if (data.length < minLength) {
            return { error: `长度不能小于${minLength}个字符` }
         } else {
            return { data }
         }
      },
      // 限制最大长度
      maxLength({ data, option: maxLength }) {
         if (data.length > maxLength) {
            return { error: `长度不能大于${maxLength}个字符` }
         } else {
            return { data }
         }
      },
      // 正则
      reg({ data, option: reg }) {
         if (data.search(reg) === -1) {
            return { error: '格式错误' }
         } else {
            return { data }
         }
      },
      // 包含
      in({ data, option: arr }) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { error: `值必须为[${arr}]选项其中之一` }
         } else {
            return { data }
         }
      },
   },
   [Number]: {
      type({ data }) {
         if (isNaN(data)) {
            return { error: '必须为数值类型' }
         } else {
            return { data: Number(data) }
         }
      },
      min({ data, option: min }) {
         if (data < min) {
            return { error: `不能小于${min}` }
         } else {
            return { data }
         }
      },
      max({ data, option: max }) {
         if (data > max) {
            return { error: `不能大于${max}` }
         } else {
            return { data }
         }
      },
      // 包含
      in({ data, option: arr }) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { error: `值必须为${arr}中的一个` }
         } else {
            return { data }
         }
      },
      // 转换类型
      to({ data, option: type }) {
         if (type === Boolean) {
            if (data) {
               return { data: true }
            } else {
               return { data: false }
            }
         }
      },
   },
   [Object]: {
      type({ data }) {
         if (typeof data !== 'object') {
            return { error: '必须为对象' }
         } else {
            return { data }
         }
      },
   },
   [Array]: {
      type({ data }) {
         if (!Array.isArray(data)) {
            return { error: '必须为数组' }
         } else {
            return { data }
         }
      },
      minLength({ data, option: minLength }) {
         if (data.length < minLength) {
            return { error: `长度不能小于${minLength}个字符` }
         } else {
            return { data }
         }
      },
      maxLength({ data, option: maxLength }) {
         if (data.length > maxLength) {
            return { error: `长度不能大于${maxLength}个字符` }
         } else {
            return { data }
         }
      },
   },
   [Date]: {
      type({ data }) {
         if (!validator.toDate(data + '')) {
            return { error: '必须为日期类型' }
         } else {
            return { data }
         }
      },
   },
   [Boolean]: {
      type({ data }) {
         if (typeof data !== 'boolean') {
            return { error: '必须为布尔值' }
         } else {
            return { data }
         }
      },
   },
   // mongoDB ID
   'MongoId': {
      type({ data }) {
         if (validator.isMongoId(String(data))) {
            return { data }
         } else {
            return { error: '必须为MongoId' }
         }
      },
   },
   // 手机号
   'MobilePhone': {
      type({ data }) {
         if (validator.isMobilePhone(String(data), 'zh-CN')) {
            return { data }
         } else {
            return { error: '必须为手机号' }
         }
      },
   },
   // 邮箱
   'Email': {
      type({ data }) {
         if (validator.isEmail(String(data))) {
            return { data }
         } else {
            return { error: '必须为Email格式' }
         }
      },
   },
}

// 方法合并
for (let key in methods) {
   methods[key] = Object.assign(methods[key], commonMethod)
}

module.exports = methods