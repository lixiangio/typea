"use strict"

let Validator = require('./index')

let query = {
   "tenderName": "测试",
   // "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "files": ["abc.js", "334", "null", "666", "12"],
   "user": {
      "username": "莉莉",
      "age": 18,
   },
   "list": [
      {
         "username": "吖吖",
         "age": 16,
      },
      {
         "username": "可可",
         "age": 15,
      }
   ],
   "money": "2",
   "guaranteeFormat": 0,
   "addressee": "嘟嘟",
   "receiveAddress": "快点",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": 168,
      "kaka": 6,
   },
   "search": "深圳",
   "searchField": "userName",
   "email": "xxx@xx.xx",
   "abc": {
      a: "1e",
      b: 2,
      c: true,
      d: 4,
   },
}


let { error, data, filter } = Validator(query,
   {
      "tenderName": {
         "type": String,
         "name": "标书名称",
         "allowNull": false,
         "default": "updatedAt",
         "and"(value) {
            if (value === 'updatedAt') {
               return ["tenderEndTime"]
            }
         },
      },
      "tenderNum": {
         "type": Number,
         "value": 666,
      },
      "tenderEndTime": {
         "type": Date,
         "name": "截标时间",
         "allowNull": false,
      },
      "user": {
         "username": String,
         "age": Number,
      },
      "list": [{
         "username": String,
         "age": Number,
      }],
      "money": {
         "type": Number,
         // "min": 15,
         // "in": [1, 2],
      },
      "files": [{
         "type": String,
         "allowNull": false,
      }],
      "guaranteeFormat": {
         "type": Number,
         "to": Boolean,
      },
      "addressee": {
         "type": String,
      },
      "search": {
         "type": String,
         // "or": ["searchField"],
      },
      "phone": {
         "type": "MobilePhone"
      },
      "receiveAddress": String,
      "coupon": {
         "type": String,
         method(value) {
            return { "$gt": value }
         }
      },
      "integral": {
         "lala": {
            "type": Number,
         },
         "kaka": {
            "type": Number,
            "allowNull": false,
            "in": [1, 3, 8, 6],
         }
      },
      "email": {
         "type": 'Email',
         method(value) {
            return [value, , null, , undefined, 666]
         }
      },
      "abc": {
         "$": Number,
      }
   },
   {
      filter() {
         let { search, email, integral } = this
         return {
            "email": email,
            "integral": integral,
            "test": {
               v1: 1,
               v2: undefined,
               v3: "",
               v4: null,
               v5: NaN,
               v6: 0,
            }
         }
      }
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
   console.log(filter)
}