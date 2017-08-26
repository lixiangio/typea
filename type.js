"use strict";

let validator = require('validator')

module.exports = {
   [String]: function (data) {
      if (typeof data === 'string') {
         return { data: data.trim() }
      } else {
         return { err: "参数必须为字符串" }
      }
   },
   [Number]: function (data) {
      if (isNaN(data)) {
         return { err: "参数必须为数值或可转换为数值的字符串" }
      } else {
         return { data: Number(data) }
      }
   },
   [Object]: function (data) {
      if (typeof data !== 'object') {
         return { err: "参数必须为对象" }
      } else {
         return { data: data }
      }
   },
   [Array]: function (data) {
      if (!Array.isArray(data)) {
         return { err: "参数必须为数组" }
      } else {
         return { data: data }
      }
   },
   [Date]: function (data) {
      if (!validator.toDate(data + '')) {
         return { err: "参数必须为日期类型" }
      } else {
         return { data: data }
      }
   },
   [Boolean]: function (data) {
      if (typeof data !== 'boolean') {
         return { err: "参数必须为布尔值" }
      } else {
         return { data: data }
      }
   },
   // mongoDB ID
   ObjectId(data) {
      if (!validator.isMongoId(data + '')) {
         return { err: "参数必须为ObjectId" }
      } else {
         return { data: data }
      }
   },
   // 手机号
   MobilePhone(data) {
      if (!validator.isMobilePhone(data + '', 'zh-CN')) {
         return { err: "参数必须为手机号" }
      } else {
         return { data: data }
      }
   }
}