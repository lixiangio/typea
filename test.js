"use strict"

let Validator = require('./index')

let query = {
   // "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "files": ["abc.js", "334", "null", "666", "12"],
   "auth": {
      "weixin": "llll",
   },
   "beneficiariesName": "莉莉",
   "guaranteeMoney": "2",
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
      a: "1",
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
         "and" (value) {
            if (value === 'updatedAt') {
               return ["tenderNum", "tenderEndTime"]
            }
         },
      },
      "tenderNum": Number,
      "tenderEndTime": {
         "type": Date,
         "name": "截标时间",
         "allowNull": false,
      },
      "auth": {
         "weixin": String,
      },
      "beneficiariesName": {
         "type": String,
         "name": "xxx",
         "allowNull": false,
      },
      "guaranteeMoney": {
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
         "type": String,
         "default": "releaseTime",
         method(value) {
            return [value, , , , , "7777"]
         }
      },
      "abc": {
         "$": {
            type: Number,
         }
      }
   },
   {
      filter() {
         let { search, email, integral } = this
         return {
            "email": email,
            "integral": integral,
            "test": {
               a: 1,
               b: undefined,
               c: "",
               d: null,
               e: NaN,
               e: 0,
            },
            $or() {
               if (search) {
                  if (search.match(/^\d+$/)) {
                     return [
                        { tenderNum: new RegExp(search) },
                        { projectNum: new RegExp(search) },
                        { tenderProjectNum: new RegExp(search) }
                     ]
                  } else {
                     return [
                        { tenderName: new RegExp(search) },
                        { projectName: new RegExp(search) },
                        { tenderProjectName: new RegExp(search) }
                     ]
                  }
               }
            },
            totalAmount() {
               return {
                  $gt: /12/,
                  $lt: 666,
               }
            },
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