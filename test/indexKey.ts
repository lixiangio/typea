import test from 'jtm';
import { Schema, indexKey } from 'typea';

test("$index", t => {

  const sample = {
    x: 12,
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
    }
  };

  const schema = new Schema({
    x: Number,
    [indexKey]: {
      type: Number,
      count: Number,
      value: String
    }
  });

  const { error, value } = schema.verify(sample);

  t.deepEqual(value, sample, error);

});
