import test from 'jtm'

const { types } = test;

test('common', t => {

   const sample = {
      "name": "测试",
      "num": "123456789987",
      "coupon": "uuuu",
      "integral": {
         "lala": "168",
         "kaka": 6,
      },
      "email": "xxx@xx.xx",
   }

   const { email } = types;

   const { error, data } = types({
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
         type: String,
         set(value) {
            return { "$gt": value }
         },
         or() {
            return ["integral-", "email"]
         }
      },
      "integral": {
         "kaka": {
            "type": Number
         }
      },
      "email": {
         "type": email
      }
   }).verify(sample);

   // console.log(data)

   t.deepEqual(data, {
      name: '测试',
      num: 666,
      coupon: { '$gt': 'uuuu' },
      integral: { kaka: 6 },
      email: 'xxx@xx.xx'
   }, error)

});