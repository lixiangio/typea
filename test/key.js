import test from 'jtm';
import types from 'typea';

const { optional, stringKey } = types;

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
    // xxx: '12'
  };

  const schema = types({
    [stringKey]: {
      type: Number,
      count: Number,
      value: String
    }
  });

  const { error, data } = schema.verify(sample, 'strict');

  t.deepEqual(sample, data, error);

});


test("optional()", t => {

  const sample = {
    data: {
      name: '123',
      value: {}
    }
  };

  const schema = types({
    [optional('data')]: {
      name: String,
      value: Object
    }
  });

  const { error, data } = schema.verify(sample, 'strict');

  t.deepEqual(sample, data, error);

});
