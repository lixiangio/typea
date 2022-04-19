import test from 'jtm'
import types from 'typea';
// import utility from 'typea/utility';

test('(...) 扩展运算符', t => {

  const sample = {
    id: "5687862c08d67e29cd000001",
    email: "erer@gmail.com",
    emais: ["erer@gmail.com", "erer@gmail.com"],
    mobilePhone: "15855555547",
    mobilePhones: [
      "15855155547",
      "18655535547",
    ],
    middlewares: [function a() { }, function b() { }, function c() { }],
    list: [12, 34, true, false, true, 'hello', 'word', true, undefined, null, []],
    date: '2022-04-09'
  }

  const { mongoId, email, mobilePhone, date, any } = types;

  const schema = types({
    "id": mongoId,
    email,
    emais: [email, email({ "allowNull": true })],
    mobilePhone,
    mobilePhones: [...mobilePhone],
    middlewares: [...Function],
    list: [...Number, true, ...Boolean, ...String, Boolean, undefined, any, []],
    date
  })

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});

test('array iterator()', t => {

  const sample = {
    a: [1, 2],
    b: ['a', 'b', 123],
    c: [666, 999, 88,],
    d: [{ a: 1, b: 2 }, { a: 2, b: 2 }, { a: 1 }],
    e: [
      [
        {
          xa: 1,
          xb: [1, 2, 3],
        },
        {
          xa: 9,
          xb: [2, 4, 3],
        }
      ]
    ]
  };

  const { number, string, iterator, $ } = types;

  const schema = types({
    a: [number, ...number],
    b: [...string, number],
    c: [...number({ "allowNull": true })],
    d: [iterator({ a: Number, [$("b")]: number })],
    e: [[iterator({ xa: Number, xb: [...number({ "allowNull": true })] })]]
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});