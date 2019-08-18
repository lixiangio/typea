"use strict";

import symbols = require('./symbol.js');
import common = require('./common.js');

import toDate = require('validator/lib/toDate.js');
import isMongoId = require('validator/lib/isMongoId.js');
import isMobilePhone = require('validator/lib/isMobilePhone.js');
import isEmail = require('validator/lib/isEmail.js');

const types = new Map();

types.set(String, {
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
   min(data, min) {
      if (data.length < min) {
         return { error: `长度不能小于${min}个字符` }
      } else {
         return { data }
      }
   },
   // 限制最大长度
   max(data, max) {
      if (data.length > max) {
         return { error: `长度不能大于${max}个字符` }
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
      const result = array.indexOf(data);
      if (result === -1) {
         return { error: `值必须为[${array}]选项其中之一` }
      } else {
         return { data }
      }
   },
})

types.set(Number, {
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
      const result = array.indexOf(data);
      if (result === -1) {
         return { error: `值必须为${array}中的一个` }
      } else {
         return { data }
      }
   }
})

types.set(Array, {
   ...common,
   type(data) {
      if (Array.isArray(data)) {
         return { data }
      } else {
         return { error: '必须为Array类型' }
      }
   },
   min(data, min) {
      if (data.length < min) {
         return { error: `长度不能小于${min}个字符` }
      } else {
         return { data }
      }
   },
   max(data, max) {
      if (data.length > max) {
         return { error: `长度不能大于${max}个字符` }
      } else {
         return { data }
      }
   },
})

types.set(Object, {
   ...common,
   type(data) {
      if (typeof data === 'object') {
         return { data }
      } else {
         return { error: '必须为Object类型' }
      }
   },
})

types.set(Boolean, {
   ...common,
   type(data) {
      if (typeof data === 'boolean') {
         return { data }
      } else {
         return { error: '必须为Boolean类型' }
      }
   },
})

types.set(Date, {
   ...common,
   type(data) {
      if (toDate(data + '')) {
         return { data }
      } else {
         return { error: '必须为Date类型' }
      }
   },
})

types.set(Function, {
   ...common,
   type(data) {
      if (typeof data === 'function') {
         return { data }
      } else {
         return { error: '必须为Function类型' }
      }
   },
})

types.set(symbols.mongoId, {
   ...common,
   type(data) {
      if (isMongoId(String(data))) {
         return { data }
      } else {
         return { error: '必须为MongoId' }
      }
   },
})

types.set(symbols.mobilePhone, {
   ...common,
   type(data) {
      if (isMobilePhone(String(data), 'zh-CN')) {
         return { data }
      } else {
         return { error: '必须为手机号' }
      }
   },
})

types.set(symbols.email, {
   ...common,
   type(data) {
      if (isEmail(String(data))) {
         return { data }
      } else {
         return { error: '必须为Email格式' }
      }
   },
})

// 数据类型验证方法
export = types;