let Verify = require('../index')

let data = {
   "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "customizeGuaranteeFormat": ["xxx.js", "xxx.js"],
   "companyName": {
      "typeId": "llll"
   },
   "beneficiariesName": "莉莉",
   "guaranteeMoney": "88343.256",
   "guaranteeFormat": 1,
   "addressee": "嘟嘟",
   "receiveAddress": "快点快点的",
   "phone": "18555555555",
   "coupon": "uuuu"
}

let verify = Verify(data,
   {
      "tenderName": String,
      "tenderNum": String,
      "tenderEndTime": Date,
      "companyName": {
         "type": {
            "typeId": {
               "type": String,
               "allowNull": true
            }
         },
         "allowNull": true
      },
      "beneficiariesName": String,
      "guaranteeMoney": Number,
      "customizeGuaranteeFormat": {
         "type": [String],
         "allowNull": true
      },
      "guaranteeFormat": {
         "type": Number
      },
      "addressee": {
         "type": String,
         "allowNull": true
      },
      "phone": String,
      "receiveAddress": String,
      "coupon": {
         "type": String
      },
      "integral": {
         "type": Number,
         "allowNull": true
      },
      "email": {
         "type": String,
         "allowNull": true
      }
   },
   {
      "define": ["filter", "uu"],
      "method": {
         "addressee": function (value) {
            this.data.xxx = value
         },
         "coupon": function (value) {
            this.data.kkk = value
         }
      },
      "depend": {
         "guaranteeFormat": ["phone"]
      },
      // "path": {
      //    "addressee": "data.xx.$.sss"
      // },
      "group": {
         "filter": ["coupon", "companyName", "phone"]
      }
   }
)

if (verify.error) {
   console.log(verify.error)
} else {
   console.log(verify.data)
   console.log(verify.filter)
}
