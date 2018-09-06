"use strict"

const test = require('jtf')
const typea = require('..')

test('common', t => {

   let sample = {
      "name": "测试",
      "num": "123456789987",
      "coupon": "uuuu",
      "integral": {
         "lala": "168",
         "kaka": 6,
      },
      "email": "xxx@xx.xx",
   }

   let { email } = typea.types

   let { error, data } = typea(sample,
      {
         "name": {
            "type": String,
            "name": "名称",
            "default": "默认值",
            "allowNull": false,
            "and": ["num"]
         },
         "num": {
            "type": Number,
            "value": 666,
            "or": ["name", 'xxx']
         },
         "coupon": {
            "type": String,
            set(value) {
               return { "$gt": value }
            },
            or() {
               return ["integral-", "email"]
            }
         },
         "integral": {
            "kaka": {
               "type": Number,
               and() {
                  return ["coupon", "email"]
               }
            }
         },
         "email": {
            "type": email,
            set(value) {
               return [value, , null, , undefined, 666]
            },
            and() {
               return ["coupon", "email"]
            }
         }
      }
   )

   // console.log(data)

   t.deepEqual({
      name: '测试',
      num: 666,
      coupon: { '$gt': 'uuuu' },
      integral: { kaka: 6 },
      email: ['xxx@xx.xx', null, 666]
   }, data, error)

});