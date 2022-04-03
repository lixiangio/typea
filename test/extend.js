import test from 'jtm'

const { types } = test;

test('extend', t => {

  const { mongoId, email, mobilePhone } = types;

  const sample = {
    "id": "5687862c08d67e29cd000001",
    "email": "erer@gmail.com",
    "mobile": "15855555547",
  }

  const { error, data } = types(
    {
      "id": {
        "type": mongoId,
        "allowNull": false
      },
      "email": {
        "type": email,
      },
      "mobile": {
        "type": mobilePhone,
      },
    }
  ).verify(sample, {
    xxx({ id, email }) {
      return [id, email];
    },
    sss({ mobile }) {
      return {
        kkk: 1212,
        mobile
      }
    },
    ccc: 666
  });

  // console.log(data)

  t.deepEqual({
    id: '5687862c08d67e29cd000001',
    email: 'erer@gmail.com',
    mobile: '15855555547',
    xxx: ['5687862c08d67e29cd000001', 'erer@gmail.com'],
    sss: { kkk: 1212, mobile: '15855555547' },
    ccc: 666
  }, data, error);

});