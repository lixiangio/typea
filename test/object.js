"use strict"

const test = require('jtf');
const typea = require('..');


test('object', t => {

  const sample = {
    type: {
      a1: 1,
      a2: 12,
    },
    b: 99,
    f(a, b) {
      return a + b
    },
  }

  const { error, data } = typea({
    type: {
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
  }).verify(sample, {
    test(data) {
      return 888;
    },
    ss: 999
  });

  t.deepEqual({
    type: { a1: 1, a2: 12 },
    b: 198,
    f: 2,
    test: 888,
    ss: 999
  }, data, error);

});