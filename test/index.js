let Verify = require('../index')

let query = {
   "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   "customizeGuaranteeFormat": ["xxx.js", "xxx.js"],
   "companyName": {
      "typeId": "llll",
   },
   "beneficiariesName": "莉莉",
   "guaranteeMoney": "88343.256",
   "guaranteeFormat": 1,
   "addressee": "嘟嘟",
   "receiveAddress": "快点快点的",
   "phone": "18565799072",
   "coupon": "uuuu",
   "integral": {
      "lala": 168,
      "kaka": 595959
   },
   "email": "xxx@xx.xx"
}

let { error, data, filter } = Verify(query,
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
         "allowNull": true,
         "rename": "uuuuu",
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
      "phone": "MobilePhone",
      "receiveAddress": String,
      "coupon": {
         "type": String
      },
      "integral": {
         "lala": {
            "type": Number,
            "allowNull": true
         },
         "kaka": {
            "type": Number,
            "allowNull": true
         }
      },
      "email": {
         "type": String,
         "allowNull": true
      },
      "ooooo": function () {
         return {
            "a": 666,
            "b": undefined,
         }
      }
   },
   {
      "methods": {
         "addressee": function (value) {
            this.data.xxx = value
         },
         "integral.kaka": function (value) {
            this.data.kkk = value
         }
      },
      "depend": {
         "guaranteeFormat": ["addressee"]
      },
      // "path": {
      //    "addressee": "data.xx.$.sss"
      // },
      "group": {
         "filter": ["coupon", "companyName", "phone", "integral", "ooooo"]
      }
   }
)

if (error) {
   console.log(error)
} else {
   console.log(data)
   console.log(filter)
}
