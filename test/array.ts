import test from 'jtm';
import { Schema, Utility, string, number, boolean, array, object } from 'typea';

const { optional } = Utility;

test('[string] 匹配 1 个', t => {

   const schema = new Schema([{ state: boolean }]);

   const sample = [{ state: true }];

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('[string, string] 匹配 2 个', t => {

   const schema = new Schema([string, string]);

   const sample = ['a', 'b'];

   const { error, value } = schema.verify(sample);

   // console.log(value);

   t.deepEqual(value, sample, error);

});

test('number[] 匹配 0 个或多个', t => {

   const schema = new Schema([...number]);

   const sample = [1, 3, 6, 9,];

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('[number, ...number] 至少匹配一个', t => {

   const schema = new Schema([number, ...number]);

   const sample = [1];

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('[[string]]', t => {

   const schema = new Schema([[string, string]]);

   const sample = [['a', 'b']];

   const { error, value } = schema.verify(sample);

   // console.log(value)

   t.deepEqual(value, sample, error);

});

test('[...object]', t => {

   const schema = new Schema([...object({
      a: Number,
      b: number({ optional: true })
   })]);

   const sample = [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }];

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('[...array]', t => {

   const schema = new Schema([...array([Number, number({ optional: true })])]);

   const sample = [[1, 10], [5, 20], [3, 4]];

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('{...array}', t => {

   const schema = new Schema({ ...array([Number, number({ optional: true })]) });

   const sample = {
      a: [1, 2],
      b: [10, 200],
      c: [100],
   };

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});

test('array 综合示例', t => {

   const schema = new Schema({
      a: [number, ...number],
      b: optional([...string, number]),
      c: [...number],
      d: [...object({ a: Number, b: number({ optional: true }) })],
      e: [
         {
            d1: number({ default: 6 }),
            d2: String
         },
         Number,
         [...object({ xa: Number, xb: [...number] })],
         String
      ],
      f: array([...number], { max: 2 }),
      ...number
   });

   const sample = {
      a: [1, 2],
      b: ['a', 'b', 123],
      c: [666, 999, 88,],
      d: [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }],
      e: [
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
      f: [1, 2, 3],
      g: 12,
      h: 66
   };

   const { error, value } = schema.verify(sample);

   t.deepEqual(value, sample, error);

});