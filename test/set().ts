import test from 'jtm';
import { Schema, number, string } from 'typea';

test('set', t => {

   const sample = {
      "name": "测试",
      "num": '123456789987',
      "coupon": " uuuu ",
      "integral": {
         "lala": "168",
         "kaka": 6,
      }
   }

   const schema = new Schema({
      "name": string({ "default": "lili" }),
      "num": string({ set() { return '666'; } }),
      "coupon": string({
         set(value: string) {
            return value.trim();
         }
      }),
      "integral": {
         "lala": "168",
         "kaka": number
      }
   });

   const { error, value } = schema.verify(sample);

   sample.coupon = "uuuu";
   sample.num = '666';

   t.deepEqual(value, sample, error)

});