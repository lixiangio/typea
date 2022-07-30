import test from 'jtm'
import { Schema, number } from 'typea';

test("type", t => {

  const schema = new Schema({
    users: {
      type: {
        type: {
          type: number({ max: 200 }),
          age: number
        }
      },
      max: number
    },
    name: 'lili',
  });

  const sample = {
    users: {
      type: {
        type: {
          type: 100,
          age: 10
        }
      },
      max: 11
    },
    name: 'lili'
  };

  const { error, value } = schema.verify(sample);

  t.deepEqual(value, sample, error);

});
