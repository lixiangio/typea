import test from 'jtm';
import { Schema, Utility, string, number } from 'typea';

const { partial } = Utility;

test("partial", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    // age: 10,
    // data: { value: 1 }
  };

  const schema = new Schema(partial({
    nane: string,
    list: [number, Boolean, Boolean, number],
    age: number,
    data: { value: 1 },
  }));

  const { error, value } = schema.verify(sample);

  t.deepEqual(value, sample, error);

});
