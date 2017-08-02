"use strict";

let validator = require('validator')

// 自定义类型
module.exports = {
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