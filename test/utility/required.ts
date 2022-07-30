import test from 'jtm';
import { Schema, Utility, string, number } from 'typea';

const { required, optional } = Utility;

test("required", t => {

  const struct = required({
    nane: string,
    age: number,
    list: optional([number, Boolean, Boolean, number, number({ default: 1 })]),
    data: { value: 1 },
  })

  const schema = new Schema(struct);

  const sample = {
    nane: 'lili',
    age: 10,
    list: [12, true, true, 100],
    data: { value: 1 }
  };

  const { error, value } = schema.verify(sample);

  sample.list[4] = 1;

  t.deepEqual(value, sample, error);

});
