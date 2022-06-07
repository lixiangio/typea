import test from 'jtm';
import { Schema, string, number } from 'typea';
import { omit } from 'typea/utility';

test("omit", t => {

  const sample = {
    nane: 'lili',
    list: [12, true, true, 100],
    // age: 10,
    data: { value: 1 }
  };

  const schema = new Schema(omit({
    nane: string,
    list: [number, Boolean, Boolean, number],
    age: number,
    data: { value: 1 },
  }, 'age'));

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
