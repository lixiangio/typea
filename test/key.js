import test from 'jtm';
import types from 'typea';

const { stringKey } = types;

test("stringKey", t => {

  const sample = {
    a: {
      type: 54,
      count: 3,
      value: 'a'
    },
    b: {
      type: 1,
      count: 10,
      value: 'b'
    },
    c: {
      type: 12,
      count: 10,
      value: 'c'
    },
    xxx: 12
  };

  const schema = types({
    xxx: Number,
    [stringKey]: {
      type: Number,
      count: Number,
      value: String
    }
  });

  const { error, data } = schema.verify(sample, 'strict');

  t.deepEqual(data, sample, error);

});
