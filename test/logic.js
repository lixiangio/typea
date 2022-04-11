import test from 'jtm'
import types from 'typea';

const sample = {
  "name": "测试",
  "num": 123,
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
      set() {
        if (sample.name || sample.xxx) {
          sample.num = 666;
          return sample.num;
        }
      }
    }),
    "email": email,
    "coupon": string({
      set($gt) {
        if (sample.integral || sample.email) {
          sample.coupon = { $gt }
          return sample.coupon;
        }
      }
    })
  })

  delete sample.integral;

  const { data, error } = schema.verify(sample);

  t.deepEqual(data, sample, error)

});