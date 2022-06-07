import test from 'jtm';
import { Schema, number, string } from 'typea';

test('set', t => {

   const sample = {
      "name": "测试",
      "num": '123456789987',
      "coupon": "uuuu",
      "integral": {
         "lala": "168",
         "kaka": 6,
      }
   }

   const schema = new Schema({
      "name": string({ "default": "lili" }),
      "num": number({ set() { return 666; } }),
      "coupon": string({
         set(value) {
            sample.coupon = value.trim();
            return sample.coupon;
         }
      }),
      "integral": {
         "lala": "168",
         "kaka": number
      }
   });

   const { error, data } = schema.verify(sample);

   sample.num = data.num;

   t.deepEqual(data, sample, error)

});