"use strict"

let Validator = require('../index')

let Test = Validator.schema('Test',
   {
      "tenderName": {
         "type": String,
         "name": "标书名称",
         "allowNull": false,
         "default": "默认值",
      },
      "tenderNum": {
         "type": Number,
         "value": 666,
      },
      "user": {
         "username": String,
         "age": Number,
         "address": [
            { "city": String, },
            { "city": String, }
         ],
      }
   }
)

console.log(Test)