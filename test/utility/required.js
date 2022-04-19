import test from 'jtm';
import types from 'typea';

const { $, string, number, required } = types;

test("required", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    age: 10,
    data: { value: 1 }
  };

  const schema = types(required({
    nane: string,
    [$('list')]: [number, Boolean, Boolean, number],
    age: number,
    data: { value: 1 },
  }));

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
