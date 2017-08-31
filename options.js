"use strict"

let validator = require('validator')

// 公共方法
let commonMethod = {
   method({ data, option: fun, output }) {
      return { data: fun.call(output, data) }
   },
   // 与
   and({ data, option: nameArray, input }) {
      for (let name of nameArray) {
         if (input[name] === undefined || input[name] === '') {
            return { err: `必须与${nameArray}参数同时存在` }
         }
      }
      return { data }
   },
   // 或
   or({ data, option: nameArray, input }) {
      let status = true
      for (let name of nameArray) {
         if (input[name] !== undefined && input[name] === '') {
            status = false
         }
      }
      if (status) {
         return { err: `必须与${nameArray}参数其中之一同时存在` }
      }
      return { data }
   },
}

// 类别方法
let typeMethod = {
   [String]: {
      // 数据类型验证
      type({ data }) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { err: '必须为字符串' }
         }
      },
      // 长度验证
      minLength({ data, option: minLength }) {
         if (data.length < minLength) {
            return { err: `长度不能小于${minLength}个字符` }
         } else {
            return { data }
         }
      },
      maxLength({ data, option: maxLength }) {
         if (data.length > maxLength) {
            return { err: `长度不能大于${maxLength}个字符` }
         } else {
            return { data }
         }
      },
      reg({ data, option: reg }) {
         if (data.search(reg) === -1) {
            return { err: '格式错误' }
         } else {
            return { data }
         }
      },
      // 包含
      in({ data, option: arr }) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { err: `值必须为${arr}中的一个` }
         } else {
            return { data }
         }
      },
   },
   [Number]: {
      type({ data }) {
         if (isNaN(data)) {
            return { err: '必须为数值或可转换为数值的字符串' }
         } else {
            return { data: Number(data) }
         }
      },
      min({ data, option: min }) {
         if (data < min) {
            return { err: `不能小于${min}` }
         } else {
            return { data }
         }
      },
      max({ data, option: max }) {
         if (data > max) {
            return { err: `不能大于${max}` }
         } else {
            return { data}
         }
      },
      // 包含
      in({ data, option: arr }) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { err: `值必须为${arr}中的一个` }
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
            return { err: '必须为对象' }
         } else {
            return { data }
         }
      },
   },
   [Array]: {
      type({ data }) {
         if (!Array.isArray(data)) {
            return { err: '必须为数组' }
         } else {
            return { data }
         }
      },
   },
   [Date]: {
      type({ data }) {
         if (!validator.toDate(data + '')) {
            return { err: '必须为日期类型' }
         } else {
            return { data }
         }
      },
   },
   [Boolean]: {
      type({ data }) {
         if (typeof data !== 'boolean') {
            return { err: '必须为布尔值' }
         } else {
            return { data }
         }
      },
   },
   // mongoDB ID
   "ObjectId": {
      type({ data }) {
         if (!validator.isMongoId(data + '')) {
            return { err: '必须为ObjectId' }
         } else {
            return { data }
         }
      },
   },
   // 手机号
   "MobilePhone": {
      type({ data }) {
         if (!validator.isMobilePhone(data + '', 'zh-CN')) {
            return { err: '必须为手机号' }
         } else {
            return { data }
         }
      },
   },
}

// 方法合并
for (let key in typeMethod) {
   typeMethod[key] = Object.assign(typeMethod[key], commonMethod)
}

module.exports = typeMethod