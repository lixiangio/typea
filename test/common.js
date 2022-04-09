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

   const { number, string, email, } = types;

   const schema = types({
      "name": string({
         "default": "lili",
         "allowNull": false
      }),
      "num": number({ "value": 666 }),
      "coupon": string({
         set($gt) {
            sample.coupon = { $gt };
            return sample.coupon;
         }
      }),
      "integral": {
         "lala": "168",
         "kaka": number
      },
      email
   })

   const { error, data } = schema.verify(sample);

   sample.num = data.num;

   t.deepEqual(sample, data, error)

});