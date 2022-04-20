import test from 'jtm';
import types from 'typea';
import { required, optional } from 'typea/utility';

const { string, number } = types;

test("required", t => {

  const sample = {
    nane: 'lili',
    age: 10,
    list: [12, true, true, 100],
    data: { value: 1 }
  };

  const schema = types(required({
    nane: string,
    age: number,
    list: optional([number, Boolean, Boolean, number]),
    data: { value: 1 },
  }));

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
