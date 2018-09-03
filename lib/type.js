"use strict"

let validator = require('validator')
let common = require('./common')
let symbols = require('./symbol')

// 数据类型验证方法
let types = {
   [String]: {
      ...common,
      // 数据类型验证
      type(data) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { error: '必须为String类型' }
         }
      },
      // 限制最小长度
      minLength(data, minLength) {
         if (data.length < minLength) {
            return { error: `长度不能小于${minLength}个字符` }
         } else {
            return { data }
         }
      },
      // 限制最大长度
      maxLength(data, maxLength) {
         if (data.length > maxLength) {
            return { error: `长度不能大于${maxLength}个字符` }
         } else {
            return { data }
         }
      },
      // 正则
      reg(data, reg) {
         if (data.search(reg) === -1) {
            return { error: '格式错误' }
         } else {
            return { data }
         }
      },
      // 包含
      in(data, array) {
         let result = array.indexOf(data)
         if (result === -1) {
            return { error: `值必须为[${array}]选项其中之一` }
         } else {
            return { data }
         }
      },
   },
   [Number]: {
      ...common,
      type(data) {
         if (isNaN(data)) {
            return { error: '必须为Number类型' }
         } else {
            return { data: Number(data) }
         }
      },
      min(data, min) {
         if (data < min) {
            return { error: `不能小于${min}` }
         } else {
            return { data }
         }
      },
      max(data, max) {
         if (data > max) {
            return { error: `不能大于${max}` }
         } else {
            return { data }
         }
      },
      // 包含
      in(data, array) {
         let result = array.indexOf(data)
         if (result === -1) {
            return { error: `值必须为${array}中的一个` }
         } else {
            return { data }
         }
      }
   },
   [Array]: {
      ...common,
      type(data) {
         if (Array.isArray(data)) {
            return { data }
         } else {
            return { error: '必须为Array类型' }
         }
      },
      minLength(data, minLength) {
         if (data.length < minLength) {
            return { error: `长度不能小于${minLength}个字符` }
         } else {
            return { data }
         }
      },
      maxLength(data, maxLength) {
         if (data.length > maxLength) {
            return { error: `长度不能大于${maxLength}个字符` }
         } else {
            return { data }
         }
      },
   },
   [Object]: {
      ...common,
      type(data) {
         if (typeof data === 'object') {
            return { data }
         } else {
            return { error: '必须为Object类型' }
         }
      },
   },
   [Boolean]: {
      ...common,
      type(data) {
         if (typeof data === 'boolean') {
            return { data }
         } else {
            return { error: '必须为Boolean类型' }
         }
      },
   },
   [Date]: {
      ...common,
      type(data) {
         if (validator.toDate(data + '')) {
            return { data }
         } else {
            return { error: '必须为Date类型' }
         }
      },
   },
   [Function]: {
      ...common,
      type(data) {
         if (typeof data === 'function') {
            return { data }
         } else {
            return { error: '必须为Function类型' }
         }
      },
   },
   [symbols.mongoId]: {
      ...common,
      type(data) {
         if (validator.isMongoId(String(data))) {
            return { data }
         } else {
            return { error: '必须为MongoId' }
         }
      },
   },
   [symbols.mobilePhone]: {
      ...common,
      type(data) {
         if (validator.isMobilePhone(String(data), 'zh-CN')) {
            return { data }
         } else {
            return { error: '必须为手机号' }
         }
      },
   },
   [symbols.email]: {
      ...common,
      type(data) {
         if (validator.isEmail(String(data))) {
            return { data }
         } else {
            return { error: '必须为Email格式' }
         }
      },
   },
}


module.exports = types