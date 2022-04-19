import test from 'jtm';
import types from 'typea';

const { string, number, partial } = types;

test("partial", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    // age: 10,
    // data: { value: 1 }
  };

  const schema = types(partial({
    nane: string,
    list: [number, Boolean, Boolean, number],
    age: number,
    data: { value: 1 },
  }));

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
