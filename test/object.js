import test from 'jtm';
import types from 'typea';

const { number, string } = types;

test('object', t => {

  const sample = {
    a: {
      a1: 1,
      a2: 12,
    },
    b: 10,
    f(a, b) {
      return a + b
    },
  }

  const type = {
    a: {
      a1: number({ allowNull: false }),
      a2: Number
    },
    b: number({
      set(data) {
        return data * 2
      }
    }),
    f(fn, set) {
      set(fn(1, 1));
      // return { s: String, m: Number }
    },
  };

  const { error, data } = types(type).verify(sample);

  sample.b = 20;
  sample.f = 2;

  t.deepEqual(data, sample, error);

});


test('object null', async t => {

  const sample = {
    a: undefined,
    b: ["kkk", "xxx"],
    c: '',
    d: null
  };

  const stringAllowNull = string({ allowNull: true })

  const { error } = types({
    a: string({
      default: 'xxx',
      allowNull: false,
    }),
    b: [String],
    c: stringAllowNull,
    d: null,
    e: undefined
  }).verify(sample, 'strict');

  sample.a = 'xxx';

  t.deepEqual(error, 'e 属性不存在', error);

});