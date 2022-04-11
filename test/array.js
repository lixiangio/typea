import test from 'jtm';
import types from 'typea';

const { number, boolean } = types;

test('array 匹配单项或多项', t => {

   const schema = types([{
      'state': boolean({ default: true })
   }])

   const sample = [{ state: true }];

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(sample, data, error);

});


test('array 匹配指定多项', t => {

   const item = {
      'state': boolean({ default: true })
   };

   const schema = types([item, item])

   const sample = [{ state: true }, { state: false }];

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(sample, data, error);

});


test('array 综合', t => {

   const sample = {
      a: ['xx', 'kk'],
      b: [666, 999, 88,],
      c: [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }],
      d: [
         {
            d1: 666,
            d2: "888"
         },
         999,
         [
            {
               xa: 1,
               xb: [1, 2, 3],
            },
            {
               xa: 9,
               xb: [2, 4, 3],
            }
         ],
         "hello"
      ],
      e: [1, 2, 3],
   };

   const { optional } = types;

   const schema = types({
      a: [String],
      b: [number({ "allowNull": false })],
      c: [
         { a: Number, [optional('b')]: Number },
         // { a: Number, [optional('b')]: Number },
         // { a: Number, [optional('b')]: Number }
      ],
      d: [
         {
            d1: 666,
            d2: String
         },
         Number,
         [
            {
               xa: Number,
               xb: [number({ "allowNull": false })],
            }
         ],
         String
      ],
      e: Array
   });

   const { error, data } = schema.verify(sample);

   t.deepEqual(sample, data, error);

});