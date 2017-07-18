let Verify = require('../index')

let data = {
   "tenderName": "测试",
   "tenderNum": "123456789987",
   "tenderEndTime": "2017-07-07T09:53:30.000Z",
   // "customizeGuaranteeFormat": ["xxx.js", "xxx.js", "xxx.js"],
   "companyName": ["xxx公司", "xxx公司", "xxx公司", "jsd"],
   "beneficiariesName": "莉莉",
   "guaranteeMoney": "88343.256",
   "guaranteeFormat": 1,
   "addressee": "嘟嘟",
   "receiveAddress": "快点快点的",
   "phone": "18555555555",
   "xxxx": "18555555555"
}

let verify = Verify(data, {
   "tenderName": String,
   "tenderNum": String,
   "tenderEndTime": Date,
   "companyName": [String],
   "beneficiariesName": String,
   "guaranteeMoney": Number,
   "customizeGuaranteeFormat": [{
      "type": String,
      "allowNull": true
   }],
   "guaranteeFormat": Number,
   "addressee": String,
   "phone": String,
   "receiveAddress": String,
   "coupon": {
      "type": String,
      "allowNull": true,
      "group": 'filter',
   },
   "integral": {
      "type": Number,
      "allowNull": true
   },
   "email": {
      "type": String,
      "allowNull": true
   }
})

if (verify.error) {
   console.log(verify.error)
} else {
   console.log(verify.data)
   console.log(verify.group)
}
