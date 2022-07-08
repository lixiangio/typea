import test from 'jtm';
import { Schema, number, string, boolean, func, object, any } from 'typea';

test('扩展运算符 [...]', t => {

  const { email, mobilePhone, date } = Schema.types;

  const schema = new Schema({
    id: string,
    email,
    emais: [email, email({ optional: true })],
    mobilePhone,
    mobilePhones: [...mobilePhone],
    middlewares: [...func],
    list: [...number, true, ...boolean, ...string, Boolean, undefined, any, []],
    date
  });

  const sample = {
    id: "5687862c08d67e29cd000001",
    email: "aaa@gmail.com",
    emais: ["aaa@gmail.com", "bbb@gmail.com"],
    mobilePhone: "15855555547",
    mobilePhones: ["15855155547", "18655535547"],
    middlewares: [function a() { }, function b() { }, function c() { }],
    list: [12, 34, true, false, true, 'hello', 'word', true, undefined, null, []],
    date: '2022-04-09'
  };

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});

// test('array [[...]]', t => {

//   const schema = new Schema({
//     a: [number, ...number],
//     b: [...string, number],
//     c: [...number],
//     d: [...object({ a: Number, b: number({ optional: true }) })],
//     e: [[...object({ xa: Number, xb: [...number] })]]
//   });

//   const xx = new Schema([
//     ...object({
//        id: Number,
//        uid: Number,
//        state: Boolean
//     })
//  ]);

//   const sample = {
//     a: [1, 2, 3],
//     b: ['a', 'b', 123],
//     c: [666, 999, 88,],
//     d: [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }],
//     e: [[
//       {
//         xa: 1,
//         xb: [1, 2, 3],
//       },
//       {
//         xa: 9,
//         xb: [2, 4, 3],
//       }
//     ]]
//   };

//   const { error, data } = schema.verify(sample);

//   t.deepEqual(data, sample, error);

// });
