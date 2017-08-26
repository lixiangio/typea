"use strict";

module.exports = {
   [String]: {
      [String]: function (data) {
         if (typeof data === 'string') {
            return { data: data.trim() }
         } else {
            return { err: "参数必须为字符串" }
         }
      },
      // 长度验证
      minLength: function (data, minLength) {
         if (data.length < minLength) {
            return { err: `参数长度不能小于${minLength}个字符` }
         } else {
            return { data: data }
         }
      },
      maxLength: function (data, maxLength) {
         if (data.length > maxLength) {
            return { err: `参数长度不能大于${maxLength}个字符` }
         } else {
            return { data: data }
         }
      },
      in: function (data, arr) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return { err: `参数可选值必须为:${arr}中的一个` }
         } else {
            return { data: data }
         }
      },
      reg: function (data, reg) {
         if (data.search(reg) === -1) {
            return { err: `参数格式错误` }
         } else {
            return { data: data }
         }
      },
   },
   [Number]: {
      [Number]: function (data) {
         if (isNaN(data)) {
            return { err: "参数必须为数值或可转换为数值的字符串" }
         } else {
            return { data: Number(data) }
         }
      },
      min: function (data, min) {
         if (data < options.min) {
            return `参数不能小于${min}`
         } else {
            return { data: data }
         }
      },
      max: function (data, max) {
         if (data > max) {
            return `参数不能大于${max}`
         } else {
            return { data: data }
         }
      },
      in: function (data, arr) {
         let result = arr.indexOf(data)
         if (result === -1) {
            return `参数可选值必须为:${arr}`
         } else {
            return { data: data }
         }
      },
      conversion: function (data, type) {
         if (type === Boolean) {
            if (data) {
               return { data: true }
            } else {
               return { data: false }
            }
         }
      },
   },
}