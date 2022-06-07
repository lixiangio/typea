import test from 'jtm';
import { Schema,  string, number } from 'typea';
import { partial } from 'typea/utility';

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

  const { error, data } = schema.verify(sample);

  t.deepEqual(data, sample, error);

});
