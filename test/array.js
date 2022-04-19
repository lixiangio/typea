import test from 'jtm';
import types from 'typea';

const { string, number, boolean } = types;

test('[string] 匹配 1 个', t => {

   const schema = types([{ 'state': boolean }]);

   const sample = [{ state: true }];

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});


test('[string, string] 匹配 2 个', t => {

   const schema = types([string, string]);

   const sample = ['a', 'b'];

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(data, sample, error);

});

test('number[] 匹配 0 个或多个', t => {

   const schema = types([...number]);

   const sample = [1, 3, 6, 9,];

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});

test('[number, ...number] 至少匹配一个', t => {

   const schema = types([number, ...number]);

   const sample = [1];

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});

test('[[string]] 嵌套数组', t => {

   const schema = types([[string, string]]);

   const sample = [['a', 'b']];

   const { error, data } = schema.verify(sample);

   // console.log(data)

   t.deepEqual(data, sample, error);

});

test('array 综合示例', t => {

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
   };

   const { iterator, $ } = types;

   const schema = types({
      a: [number, ...number],
      b: [...string, number],
      c: [...number({ "allowNull": true })],
      d: [iterator({ a: Number, [$("b")]: number })],
      e: [
         {
            d1: 666,
            d2: String
         },
         Number,
         [iterator({ xa: Number, xb: [...number({ "allowNull": true })] })],
         String
      ],
      f: Array
   });

   const { error, data } = schema.verify(sample);

   t.deepEqual(data, sample, error);

});