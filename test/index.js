"use strict";

let Verify = require('../index')

let query = {
   "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "files": ["abc.js", "334", , "666", , "kkk.js"],
   "auth": {
      "weixin": "llll",
   },
   "beneficiariesName": "莉莉",
   "guaranteeMoney": "88343.256",
   "guaranteeFormat": 0,
   // "addressee": "嘟嘟",
   "receiveAddress": "快点快点的",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": 168,
      "kaka": "3"
   },
   "email": "xxx@xx.xx"
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
      "guaranteeMoney": Number,
      "files": [{
         "type": String,
         "allowNull": false,
      }],
      "guaranteeFormat": {
         "type": Number,
         "conversion": Boolean
      },
      "addressee": {
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
            return [value, "7777"]
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
         return {
            "email": email,
            "integral": integral,
            // "$or": function () {
            //    if (search.match(/^\d+$/)) {
            //       return [
            //          { tenderName: new RegExp(search) },
            //          { projectName: new RegExp(search) },
            //          { tenderProjectName: new RegExp(search) }
            //       ]
            //    } else {
            //       return [
            //          { tenderNum: new RegExp(search) },
            //          { projectNum: new RegExp(search) },
            //          { tenderProjectNum: new RegExp(search) }
            //       ]
            //    }
            // },
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
