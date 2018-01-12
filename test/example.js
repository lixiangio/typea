"use strict"

let Validator = require('..')

let json = {
   "name": "测试",
   "num": "123456789987",
   "ObjectId": "59c8aea808deec3fc8da56b6",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "files": ["abc.js", "334", "null", "666", "12"],
   "user": {
      "username": "莉莉",
      "age": 18,
      "address": [
         {
            "city": "深圳",
         },
         {
            "city": "北京",
         }
      ],
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
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": "168",
      "kaka": 6,
   },
   "search": "深圳",
   "searchField": "userName",
   "email": "xxx@xx.xx",
   "arr": ['jjsd', 'ddd']
}

let { error, data } = Validator(json,
   {
      "name": {
         "type": String,
         "name": "名称",
         "allowNull": false,
         "default": "默认值"
      },
      "num": {
         "type": Number,
         "value": 666,
      },
      "tenderEndTime": {
         "type": Date,
         "name": "截标时间",
         "allowNull": false,
      },
      "ObjectId": {
         "type": "MongoId",
      },
      "user": {
         "username": String,
         "age": Number,
         "address": [
            {
               "city": String,
            },
            {
               "city": String,
            }
         ],
      },
      "list": [
         {
            "username": String,
            "age": Number,
         },
         {
            "allowNull": false,
         }
      ],
      "money": {
         "type": Number,
         // "min": 15,
         // "in": [1, 2],
      },
      "files": [{
         "type": String,
         "allowNull": false,
      }, false],
      "guaranteeFormat": {
         "type": Number,
         "to": Boolean,
      },
      "addressee": String,
      "search": {
         "type": String,
         // "or": ["searchField"],
      },
      "phone": {
         "type": "MobilePhone"
      },
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
      "arr": Array,
   },
   {
      filter({ search, email, integral }) {
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
      },
      where({ search, email, integral }) {
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
   return
}

console.log(data)
console.log(data.filter)
console.log(data.where)