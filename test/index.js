"use strict";

let Verify = require('../index')

let query = {
   "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "files": ["abc.js", "334", "null", "666", , , , , , "kkk.js"],
   "auth": {
      "weixin": "llll",
   },
   "beneficiariesName": "莉莉",
   "guaranteeMoney": 2,
   "guaranteeFormat": 0,
   // "addressee": "嘟嘟",
   "receiveAddress": "快点快点的",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": 168,
      "kaka": "3"
   },
   "search": "深圳",
   "email": "xxx@xx.xx",
   "key": {
      a: "1",
      b: 2,
      c: 999,
      d: 4
   }
}

let { error, data, filter } = Verify(query,
   {
      "tenderName": {
         "type": String,
         "allowNull": false
      },
      "tenderNum": String,
      "tenderEndTime": Date,
      "auth": {
         "weixin": String,
      },
      "beneficiariesName": String,
      "guaranteeMoney": {
         "type": Number,
         "in": [1, 2]
      },
      "files": [{
         "type": String,
         // "allowNull": false,
      }],
      "guaranteeFormat": {
         "type": Number,
         "conversion": Boolean
      },
      "addressee": {
         "type": String,
      },
      "search": {
         "type": String,
      },
      "phone": {
         "type": "MobilePhone"
      },
      "receiveAddress": String,
      "coupon": {
         "type": String,
         method(value) {
            return { "$gt": new Date() }
         }
      },
      "integral": {
         "lala": {
            "type": Number,
         },
         "kaka": {
            "type": Number,
            "in": [1, 2, 3],
         }
      },
      "email": {
         "type": String,
         "default": "releaseTime",
         method(value) {
            return [value, , , , , "7777"]
         }
      },
      "key": {
         "$": {
            type: Number,
         }
      },
   },
   {
      "coexist": [
         ["guaranteeFormat", "addressee"],
         ["tenderName", "tenderNum"],
      ],
      filter() {
         let { search, email, integral } = this
         let output = {
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
            },
            totalAmount() {
               return {
                  $gt: /12/,
                  $lt: 888,
               }
            },
         }
         return output
      }
   }
)

if (error) {
   console.log(error)
   return
}

console.log(data)
console.log(filter)
