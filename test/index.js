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
   "search": "34343",
   "email": "xxx@xx.xx",
   "kes": {
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
      "phone": "MobilePhone",
      "receiveAddress": String,
      "coupon": {
         "type": String
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
      "kes": {
         $: {
            type: Number,
         }
      },
      "$or": function () {
         return {
            a: undefined,
            b: null,
            c: 0,
            d: '',
            e: "xx"
         }
      }
   },
   {
      "coexist": [
         ["guaranteeFormat", "addressee"],
         ["tenderName", "tenderNum"],
      ],
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
            "$or": function () {
               if (search.match(/^\d+$/)) {
                  return [
                     { tenderName: new RegExp(search) },
                     { projectName: new RegExp(search) },
                     { tenderProjectName: new RegExp(search) }
                  ]
               } else {
                  return [
                     { tenderNum: new RegExp(search) },
                     { projectNum: new RegExp(search) },
                     { tenderProjectNum: new RegExp(search) }
                  ]
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
