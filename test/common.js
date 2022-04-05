import test from 'jtm';
import types from 'typea';

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

   const schema = types({
      "name": {
         "type": String,
         "name": "名称",
         "default": "默认值",
         "allowNull": false
      },
      "num": {
         "type": Number,
         "value": 666
      },
      "coupon": {
         type: String,
         set($gt) { return { $gt } }
      },
      "integral": {
         "kaka": Number
      },
      "email": {
         "type": email
      }
   })

   const { error, data } = schema.verify(sample);

   t.deepEqual({
      name: '测试',
      num: 666,
      coupon: { '$gt': 'uuuu' },
      integral: { kaka: 6 },
      email: 'xxx@xx.xx'
   }, data, error)

});