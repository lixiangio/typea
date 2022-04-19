import test from 'jtm';
import types from 'typea';

const { string, number, pick } = types;

test("pick", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    // age: 10,
    // data: { value: 1 }
  };

  const schema = types(pick({
    nane: string,
    list: [number, Boolean, Boolean, number],
    age: number,
    data: { value: 1 },
  }, 'nane', 'list'));

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
