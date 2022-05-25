import test from 'jtm';
import { Schema, string, number } from 'typea';
import { required, optional } from 'typea/utility';

test("required", t => {

  const struct = required({
    nane: string,
    age: number,
    list: optional([number, Boolean, Boolean, number, number({ default: 1 })]),
    data: { value: 1 },
  })

  const schema = Schema(struct);

  const sample = {
    nane: 'lili',
    age: 10,
    list: [12, true, true, 100],
    data: { value: 1 }
  };

  const { error, data } = schema.verify(sample);

  sample.list[4] = 1;

  t.deepEqual(data, sample, error);

});
