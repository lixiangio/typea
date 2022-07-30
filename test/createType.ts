import test from 'jtm';
import { createType, Schema } from 'typea';

const int = createType('int', {
   type(data) {
      if (Number.isInteger(data)) {
         return { data }
      } else {
         return { error: '必须为int类型' };
      }
   },
   max(data, max) {
      if (data > max) {
         return { error: `不能大于${max}` };
      } else {
         return { data };
      }
   },
   in(data, array) {
      const result = array.indexOf(data);
      if (result === -1) {
         return { error: `值必须为${array}中的一个` };
      } else {
         return { data };
      }
   }
});

test(`type('int')`, t => {

   const sample = {
      "id": 6,
      "age": 15,
   };

   const { error, value } = new Schema({
      "id": int({ "in": [3, 5, 7, 6] }),
      "age": int({
         "max": 50,
         set(value: number) {
            sample.age = value * 2;
            return sample.age;
         }
      }),
   }).verify(sample);

   t.deepEqual(value, sample, error);

});