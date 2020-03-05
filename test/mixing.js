"use strict"

const test = require('jtf')
const typea = require('..').default

const sample = {
   "name": "测试",
   "num": "123456789987",
   "ObjectId": "59c8aea808deec3fc8da56b6",
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
         "age": {
            "kk": [{ kkk: 666 }]
         },
      },
      {
         "username": "可可",
         "age": {
            "kk": [
               { kkk: 666 },
               { kkk: 999 }
            ]
         },
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

test('mixing', t => {

   const { mongoId, email, mobilePhone } = typea.types;

   const schema = typea({
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
      "ObjectId": mongoId,
      "user": {
         "username": "莉莉",
         "age": Number,
         "address": [
            {
               "city": String,
            },
            {
               "city": "北京",
            }
         ],
      },
      "list": [
         {
            "username": String,
            "age": {
               "kk": [{ kkk: Number }]
            },
         }
      ],
      "money": {
         "type": Number,
         "min": 1,
         "in": [1, 2],
      },
      "files": [{
         "type": String,
         "allowNull": false,
      }],
      "guaranteeFormat": {
         "type": Number,
         "to": Boolean,
      },
      "addressee": String,
      "search": "深圳",
      "phone": {
         "type": mobilePhone
      },
      "coupon": {
         "type": String,
         set(value) {
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
         "type": email,
         set(value) {
            return [value, , null, , undefined, 666]
         }
      },
      "arr": [String],
   },
      {
         filter({ email, integral }) {
            return {
               email,
               integral,
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
         where({ email, integral }) {
            return {
               email,
               integral,
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

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.ok(data, error);

});