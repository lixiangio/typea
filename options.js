"use strict";

let validator = require('validator')

let { method } = {
   method(data, fun, output) {
      return { data: fun.call(output, data) }
   },
   // 共存参数
   and(data, nameArray, input) {
      for (let name of nameArray) {

      }
      return { data: fun.call(output, data) }
   },
}

module.exports = {
   [String]: {
      // 数据类型验证
      type(data) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { err: "必须为字符串" }
         }
      },
      // 长度验证
      minLength(data, minLength) {
         if (data.length < minLength) {
            return { err: `长度不能小于${minLength}个字符` }
         } else {
            return { data: data }
         }
      },
      maxLength(data, maxLength) {
         if (data.length > maxLength) {
            return { err: `长度不能大于${maxLength}个字符` }
         } else {
            return { data: data }
         }
      },
      in(data, arr) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { err: `可选值必须为:${arr}中的一个` }
         } else {
            return { data: data }
         }
      },
      reg(data, reg) {
         if (data.search(reg) === -1) {
            return { err: `格式错误` }
         } else {
            return { data: data }
         }
      },
      method
   },
   [Number]: {
      type(data) {
         if (isNaN(data)) {
            return { err: "必须为数值或可转换为数值的字符串" }
         } else {
            return { data: Number(data) }
         }
      },
      min(data, min) {
         if (data < options.min) {
            return `不能小于${min}`
         } else {
            return { data: data }
         }
      },
      max(data, max) {
         if (data > max) {
            return `不能大于${max}`
         } else {
            return { data: data }
         }
      },
      in(data, arr) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return `可选值必须为:${arr}`
         } else {
            return { data: data }
         }
      },
      conversion(data, type) {
         if (type === Boolean) {
            if (data) {
               return { data: true }
            } else {
               return { data: false }
            }
         }
      },
      method
   },
   [Object]: {
      type(data) {
         if (typeof data !== 'object') {
            return { err: "必须为对象" }
         } else {
            return { data: data }
         }
      },
      method
   },
   [Array]: {
      type(data) {
         if (!Array.isArray(data)) {
            return { err: "必须为数组" }
         } else {
            return { data: data }
         }
      },
      method
   },
   [Date]: {
      type(data) {
         if (!validator.toDate(data + '')) {
            return { err: "必须为日期类型" }
         } else {
            return { data: data }
         }
      },
      method
   },
   [Boolean]: {
      type(data) {
         if (typeof data !== 'boolean') {
            return { err: "必须为布尔值" }
         } else {
            return { data: data }
         }
      },
      method
   },
   // mongoDB ID
   ObjectId: {
      type(data) {
         if (!validator.isMongoId(data + '')) {
            return { err: "必须为ObjectId" }
         } else {
            return { data: data }
         }
      },
      method
   },
   // 手机号
   MobilePhone: {
      type(data) {
         if (!validator.isMobilePhone(data + '', 'zh-CN')) {
            return { err: "必须为手机号" }
         } else {
            return { data: data }
         }
      },
      method
   },
}