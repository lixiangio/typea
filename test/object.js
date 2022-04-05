import test from 'jtm';
import types from 'typea';

test('object', t => {

  const sample = {
    a: {
      a1: 1,
      a2: 12,
    },
    b: 99,
    f(a, b) {
      return a + b
    },
  }

  const type = {
    a: {
      a1: {
        type: Number,
        allowNull: false
      },
      a2: Number
    },
    b: {
      type: Number,
      name: "拉拉",
      set(data) {
        return data * 2
      }
    },
    f: {
      type: Function,
      set(func) {
        return func(1, 1)
      }
    },
  };

  const { error, data } = types(type).verify(sample, {
    test() { return 888; },
    ss: 999
  });

  t.deepEqual({
    a: { a1: 1, a2: 12 },
    b: 198,
    f: 2,
    test: 888,
    ss: 999
  }, data, error);

});


test('object null', async t => {

  const sample = {
    a: undefined,
    b: ["kkk", "xxx"],
    c: '',
    d: null
  };

  const { error, data } = types({
    a: {
      type: String,
      allowNull: false,
      default: 'xxx',
    },
    b: [String],
    c: {
      type: String,
      allowNull: true,
    },
    d: {
      type: String,
      allowNull: true,
    }
  }).strictVerify(sample);


  t.deepEqual({
    a: 'xxx',
    b: ["kkk", "xxx"],
    c: '',
    d: null
  }, data, error);

});