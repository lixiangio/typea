"use strict"

let validator = require('validator')
let symbols = require('./symbol')

// 公共方法
let common = {
   // 参数自定义转换方法
   set({ data, option: fun, origin }) {
      return { data: fun.call(origin, data) }
   },
   // 直接赋值（覆盖原来的值）
   value({ option: value }) {
      return { data: value }
   },
   // 与
   and({ data, option, origin }) {
      // option为函数时先执行函数，将函数转为数组表达式
      if (option instanceof Function) {
         option = option.call(origin, data)
      }
      // 数组表达式
      if (option instanceof Array) {
         for (let name of option) {
            if (origin[name] === undefined || origin[name] === '') {
               return { error: `必须与${name}参数同时存在` }
            }
         }
      }
      return { data }
   },
   // 或
   or({ data, option, origin }) {
      // 如果option为函数，应先执行函数，将函数转为数组
      if (option instanceof Function) {
         option = option.call(origin, data)
      }
      if (option instanceof Array) {
         let status = true
         for (let name of option) {
            if (origin[name] !== undefined && origin[name] !== '') {
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

// 数据类型验证方法
let types = {
   [String]: {
      // 数据类型验证
      type({ data }) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { error: '必须为String类型' }
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
            return { error: '必须为Number类型' }
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
      }
   },
   [Array]: {
      type({ data }) {
         if (Array.isArray(data)) {
            return { data }
         } else {
            return { error: '必须为Array类型' }
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
   [Object]: {
      type({ data }) {
         if (typeof data === 'object') {
            return { data }
         } else {
            return { error: '必须为Object类型' }
         }
      },
   },
   [Boolean]: {
      type({ data }) {
         if (typeof data === 'boolean') {
            return { data }
         } else {
            return { error: '必须为Boolean类型' }
         }
      },
   },
   [Date]: {
      type({ data }) {
         if (validator.toDate(data + '')) {
            return { data }
         } else {
            return { error: '必须为Date类型' }
         }
      },
   },
   [Function]: {
      type({ data }) {
         if (typeof data === 'function') {
            return { data }
         } else {
            return { error: '必须为Function类型' }
         }
      },
   },
   [symbols.mongoId]: {
      type({ data }) {
         if (validator.isMongoId(String(data))) {
            return { data }
         } else {
            return { error: '必须为MongoId' }
         }
      },
   },
   [symbols.mobilePhone]: {
      type({ data }) {
         if (validator.isMobilePhone(String(data), 'zh-CN')) {
            return { data }
         } else {
            return { error: '必须为手机号' }
         }
      },
   },
   [symbols.email]: {
      type({ data }) {
         if (validator.isEmail(String(data))) {
            return { data }
         } else {
            return { error: '必须为Email格式' }
         }
      },
   },
}


// 将common与内置构造函数key中方法合并
for (let key in types) {
   Object.assign(types[key], common)
}

// 将common与Symbol key中方法合并（for/in 无法遍历symbol key，需要单独处理）
for (let name in symbols) {
   let symbol = symbols[name]
   Object.assign(types[symbol], common)
}

module.exports = types