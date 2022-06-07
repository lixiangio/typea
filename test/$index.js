import test from 'jtm';
import { Schema, $index } from 'typea';

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
    [$index]: {
      type: Number,
      count: Number,
      value: String
    }
  });

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
