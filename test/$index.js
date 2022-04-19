import test from 'jtm';
import types from 'typea';

const { $, $index } = types;

test("$(name)", t => {

  const sample = {
    data: {
      name: '123',
      value: {}
    }
  };

  const schema = types({
    [$('data')]: {
      name: String,
      value: Object
    }
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});


test("$index", t => {

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
    [$index]: {
      type: Number,
      count: Number,
      value: String
    }
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});