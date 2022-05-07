import test from 'jtm'
import types from 'typea';

test("type", t => {

  const { number } = types;

  const schema = types({
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

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
