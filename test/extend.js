import test from 'jtm'
import types from 'typea';

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
    list: [...Number, true, ...Boolean, ...String, Boolean, undefined, any, []],
    date
  })

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});