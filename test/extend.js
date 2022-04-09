import test from 'jtm'
import types from 'typea';

test('extend type', t => {

  const { mongoId, email, mobilePhone, date } = types;

  const schema = types({
    "id": mongoId({ "allowNull": false }),
    email,
    mobilePhone,
    "mobileArr": [
      mobilePhone,
      mobilePhone({ "allowNull": false })
   ],
    date
  })

  const sample = {
    "id": "5687862c08d67e29cd000001",
    "email": "erer@gmail.com",
    "mobilePhone": "15855555547",
    "mobileArr": [
      "15855155547",
      "18955535547",
   ],
    "date": '2022-04-09'
  }

  const { error, data } = schema.verify(sample);

  t.deepEqual(sample, data, error);

});