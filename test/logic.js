import test from 'jtm'
import types from 'typea';

const sample = {
  "name": "测试",
  "num": "123456789987",
  "coupon": "uuuu",
  "integral": {
    "lala": "168",
    "kaka": 6,
  },
  "email": "xxx@xx.xx",
}

test('and / or', t => {

  const { email, string, number } = types;

  const schema = types({
    "name": string({
      "default": "测试",
      "allowNull": false,
      set(value) {
        if (sample.num) return value;
      }
    }),
    "num": number({
      "value": 666,
      set(value) {
        if (sample.name || sample.xxx) {
          return value;
        }
      }
    }),
    "email": email,
    "coupon": string({
      set($gt) {
        if (sample.integral || sample.email) {
          return { $gt };
        }
      }
    })
  })

  const { data, error } = schema.verify(sample);

  t.deepEqual(data, {
    name: '测试',
    num: 666,
    coupon: { '$gt': 'uuuu' },
    email: 'xxx@xx.xx'
  }, error)

});